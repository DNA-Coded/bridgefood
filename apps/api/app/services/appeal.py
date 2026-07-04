import logging
from typing import List, Optional
from app.repositories.appeal import appeal_repository
from app.repositories.food import food_repository
from app.repositories.org import org_repository
from app.schemas.appeal import AppealCreate
from app.services.email import email_service

logger = logging.getLogger("foodbridge.services.appeal")

class AppealService:
    async def create_appeal(self, receiver_id: str, appeal: AppealCreate) -> dict:
        # 1. Create appeal record
        record = await appeal_repository.create(receiver_id, appeal)
        listing = await food_repository.get_by_id(appeal.listing_id)
        org = await org_repository.get_by_id(receiver_id)
        ngo_name = org.get("name") if org else "Shelter Coordination Unit"
        
        # 2. Add to timeline
        await food_repository.add_timeline_event(
            appeal.listing_id, 
            "Appeal Received", 
            f"Pickup appeal submitted by {ngo_name}."
        )

        # 3. Notification to donor representative
        donor_email = "donor@foodbridge.org"
        if listing and listing.get("contact_person"):
            donor_email = f"{listing.get('contact_person').lower().replace(' ', '')}@foodbridge.org"
            
        await email_service.send_email(
            recipient=donor_email,
            template_type="APPEAL_CONFIRMATION",  
            context={
                "ngo_name": ngo_name,
                "food_name": listing.get("title") if listing else "Surplus Food",
                "message": appeal.message
            }
        )

        # 4. Confirmation email to receiver
        receiver_email = org.get("email") if org else f"contact@{ngo_name.lower().replace(' ', '')}.org"
        await email_service.send_email(
            recipient=receiver_email,
            template_type="APPEAL_CONFIRMATION",
            context={
                "ngo_name": ngo_name,
                "food_name": listing.get("title") if listing else "Surplus Food",
                "message": appeal.message
            }
        )
        return record

    async def list_appeals(self, listing_id: Optional[str] = None) -> List[dict]:
        return await appeal_repository.list_appeals(listing_id=listing_id)

    async def accept_appeal(self, appeal_id: str) -> dict:
        # Get the chosen appeal
        appeal = await appeal_repository.get_by_id(appeal_id)
        if not appeal:
            raise ValueError("Appeal not found")
        
        listing_id = appeal["listing_id"]
        listing = await food_repository.get_by_id(listing_id)
        winning_receiver_id = appeal["receiver_id"]
        winning_org = await org_repository.get_by_id(winning_receiver_id)
        winning_ngo_name = winning_org.get("name") if winning_org else "Shelter Coordination Unit"

        # 1. Accept target appeal
        await appeal_repository.update_status(appeal_id, "ACCEPTED")

        # 2. Reject other appeals for the same listing
        all_appeals = await appeal_repository.list_appeals(listing_id=listing_id)
        for app in all_appeals:
            if app["id"] != appeal_id:
                await appeal_repository.update_status(app["id"], "CLOSED")
                # Send rejection notification/email
                other_org = await org_repository.get_by_id(app["receiver_id"])
                if other_org:
                    other_email = other_org.get("email") or f"contact@{other_org['name'].lower().replace(' ', '')}.org"
                    await email_service.send_email(
                        recipient=other_email,
                        template_type="APPEAL_REJECTED",
                        context={
                            "ngo_name": other_org["name"],
                            "food_name": listing.get("title") if listing else "Surplus Food"
                        }
                    )

        # 3. Update listing state to LOCKED
        await food_repository.update(listing_id, {"state": "LOCKED"})

        # 4. Create donation record
        from app.schemas.donation import DonationCreate
        from app.repositories.donation import donation_repository
        donation_create = DonationCreate(
            listing_id=listing_id,
            accepted_request_id=appeal_id
        )
        donation = await donation_repository.create(donation_create)

        # 5. Timeline update
        await food_repository.add_timeline_event(
            listing_id, "Appeal Accepted", f"Pickup appeal from {winning_ngo_name} accepted."
        )
        await food_repository.add_timeline_event(
            listing_id, "Pickup Scheduled", f"Pickup locked with code {donation['pickup_code']}."
        )

        # 6. Send acceptance email to winning receiver
        winning_email = winning_org.get("email") if winning_org else f"contact@{winning_ngo_name.lower().replace(' ', '')}.org"
        await email_service.send_email(
            recipient=winning_email,
            template_type="APPEAL_ACCEPTED",
            context={
                "ngo_name": winning_ngo_name,
                "food_name": listing.get("title") if listing else "Surplus Food",
                "pickup_code": donation["pickup_code"],
                "address": listing.get("pickup_address") if listing else "Donor location",
                "contact_person": listing.get("contact_person") if listing else "Donor contact",
                "contact_number": listing.get("contact_number") if listing else "Phone"
            }
        )

        return donation

appeal_service = AppealService()

import logging
from typing import List, Optional
from app.repositories.donation import donation_repository
from app.repositories.food import food_repository
from app.repositories.appeal import appeal_repository
from app.repositories.org import org_repository
from app.schemas.donation import DonationCreate
from app.services.email import email_service

logger = logging.getLogger("foodbridge.services.donation")

class DonationService:
    async def create_donation(self, donation: DonationCreate) -> dict:
        return await donation_repository.create(donation)

    async def list_donations(self, listing_id: Optional[str] = None) -> List[dict]:
        return await donation_repository.list_donations(listing_id=listing_id)

    async def get_donation(self, id: str) -> Optional[dict]:
        return await donation_repository.get_by_id(id)

    async def complete_donation(self, id: str) -> Optional[dict]:
        donation = await donation_repository.mark_completed(id)
        if not donation:
            return None
        
        listing_id = donation["listing_id"]
        listing = await food_repository.get_by_id(listing_id)
        
        # Update listing state to COMPLETED
        await food_repository.update(listing_id, {"state": "COMPLETED"})

        # Get winning receiver name from the accepted appeal
        appeal_id = donation["accepted_request_id"]
        appeal = await appeal_repository.get_by_id(appeal_id)
        
        receiver_name = "Receiver Partner"
        receiver_email = "receiver@foodbridge.org"
        if appeal:
            org = await org_repository.get_by_id(appeal["receiver_id"])
            if org:
                receiver_name = org.get("name")
                receiver_email = org.get("email") or f"contact@{receiver_name.lower().replace(' ', '')}.org"

        # 1. Timeline Update
        await food_repository.add_timeline_event(
            listing_id,
            "Donation Completed",
            f"Surplus food batch collected and validated successfully by {receiver_name}."
        )

        # 2. Send Donation Completed Email to Donor Representative
        donor_email = "donor@foodbridge.org"
        donor_name = "Donor Representative"
        if listing:
            donor_name = listing.get("contact_person") or "Donor"
            donor_email = f"{donor_name.lower().replace(' ', '')}@foodbridge.org"
            
        await email_service.send_email(
            recipient=donor_email,
            template_type="DONATION_COMPLETED",
            context={
                "donor_name": donor_name,
                "food_name": listing.get("title") if listing else "Surplus Food",
                "ngo_name": receiver_name
            }
        )

        # 3. Send Thank You Email to both Donor and Receiver
        await email_service.send_email(
            recipient=receiver_email,
            template_type="THANK_YOU",
            context={
                "ngo_name": receiver_name,
                "co2_saved": "37.5",
                "meals_served": "30"
            }
        )
        
        await email_service.send_email(
            recipient=donor_email,
            template_type="THANK_YOU",
            context={
                "ngo_name": donor_name,
                "co2_saved": "37.5",
                "meals_served": "30"
            }
        )

        return donation

donation_service = DonationService()

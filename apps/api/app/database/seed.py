"""
FoodBridge - Database Seed Script

Inserts realistic demo data for development/demo environments.
Run with:  python -m app.database.seed

Safe to run multiple times — checks for existing data before inserting.
"""
import asyncio
import logging
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.database.client import connect, disconnect, get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("foodbridge.seed")

# ── Helpers ────────────────────────────────────────────────────────────────────

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

def hours_from_now(h: int) -> datetime:
    return utcnow() + timedelta(hours=h)


# ── Seed Data ──────────────────────────────────────────────────────────────────

ORGANIZATIONS = [
    # Donors
    {
        "_id": "org_donor_001",
        "user_id": "usr_donor_001",
        "name": "The Grand Hyatt Mumbai",
        "category": "hotel",
        "sub_type": "5-star hotel",
        "description": "Leading luxury hotel with banquet facilities serving 500+ guests daily.",
        "address": {"street": "Vakola, Santacruz East", "city": "Mumbai", "zip": "400055"},
        "city": "Mumbai",
        "state": "Maharashtra",
        "contact_email": "csr@grandhyattmumbai.com",
        "contact_phone": "+91-22-6676-1234",
        "contact_person": "Priya Sharma",
        "verified": True,
        "is_approved": True,
        "role": "donor",
        "capacity_kg_per_day": 150,
        "operating_hours": "24/7",
        "location": {"type": "Point", "coordinates": [72.855, 19.082]},
        "dietary_preferences": ["vegetarian", "non-vegetarian"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_donor_002",
        "user_id": "usr_donor_002",
        "name": "Annapoorna Restaurant Chain",
        "category": "restaurant",
        "sub_type": "South Indian restaurant chain",
        "description": "Chain of 8 authentic South Indian restaurants across Bengaluru.",
        "address": {"street": "Koramangala 4th Block", "city": "Bengaluru", "zip": "560034"},
        "city": "Bengaluru",
        "state": "Karnataka",
        "contact_email": "donations@annapoorna.in",
        "contact_phone": "+91-80-4128-5670",
        "contact_person": "Rajesh Kumar",
        "verified": True,
        "is_approved": True,
        "role": "donor",
        "capacity_kg_per_day": 80,
        "operating_hours": "06:00-23:00",
        "location": {"type": "Point", "coordinates": [77.627, 12.935]},
        "dietary_preferences": ["vegetarian", "vegan"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_donor_003",
        "user_id": "usr_donor_003",
        "name": "Spencer's Hypermarket",
        "category": "supermarket",
        "sub_type": "Hypermarket",
        "description": "Large format supermarket chain with significant daily near-expiry stock.",
        "address": {"street": "Phoenix Marketcity, Nagar Road", "city": "Pune", "zip": "411014"},
        "city": "Pune",
        "state": "Maharashtra",
        "contact_email": "surplus@spencers.in",
        "contact_phone": "+91-20-4115-9800",
        "contact_person": "Anjali Desai",
        "verified": True,
        "is_approved": True,
        "role": "donor",
        "capacity_kg_per_day": 300,
        "operating_hours": "09:00-22:00",
        "location": {"type": "Point", "coordinates": [73.941, 18.568]},
        "dietary_preferences": ["vegetarian", "non-vegetarian", "packaged"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_donor_004",
        "user_id": "usr_donor_004",
        "name": "Metro Wholesale India Pvt Ltd",
        "category": "warehouse",
        "sub_type": "B2B wholesale warehouse",
        "description": "Wholesale distribution centre with regular stock clearance programs.",
        "address": {"street": "Turbhe MIDC", "city": "Navi Mumbai", "zip": "400705"},
        "city": "Navi Mumbai",
        "state": "Maharashtra",
        "contact_email": "foodwaste@metro.in",
        "contact_phone": "+91-22-2763-4500",
        "contact_person": "Vikram Singh",
        "verified": True,
        "is_approved": True,
        "role": "donor",
        "capacity_kg_per_day": 500,
        "operating_hours": "07:00-20:00",
        "location": {"type": "Point", "coordinates": [73.029, 19.071]},
        "dietary_preferences": ["vegetarian", "non-vegetarian", "raw"],
        "created_at": utcnow(),
    },
    # Receivers
    {
        "_id": "org_recv_001",
        "user_id": "usr_recv_001",
        "name": "Akshaya Patra Foundation",
        "category": "ngo",
        "sub_type": "Midday meal programme NGO",
        "description": "World's largest NGO-run school meal programme serving 2M+ children daily.",
        "address": {"street": "Rajajinagar", "city": "Bengaluru", "zip": "560010"},
        "city": "Bengaluru",
        "state": "Karnataka",
        "contact_email": "coordinator@akshayapatra.org",
        "contact_phone": "+91-80-3014-7777",
        "contact_person": "Sudha Murthy",
        "verified": True,
        "is_approved": True,
        "role": "receiver",
        "capacity_kg_per_day": 5000,
        "operating_hours": "06:00-18:00",
        "location": {"type": "Point", "coordinates": [77.554, 12.991]},
        "dietary_preferences": ["vegetarian"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_recv_002",
        "user_id": "usr_recv_002",
        "name": "Snehalaya Community Kitchen",
        "category": "community_kitchen",
        "sub_type": "Urban community kitchen",
        "description": "Provides free meals to street workers, homeless, and daily wage labourers in Mumbai.",
        "address": {"street": "Dharavi", "city": "Mumbai", "zip": "400017"},
        "city": "Mumbai",
        "state": "Maharashtra",
        "contact_email": "meals@snehalaya.org",
        "contact_phone": "+91-22-2407-6500",
        "contact_person": "Sr. Lucy Kurien",
        "verified": True,
        "is_approved": True,
        "role": "receiver",
        "capacity_kg_per_day": 800,
        "operating_hours": "07:00-21:00",
        "location": {"type": "Point", "coordinates": [72.858, 19.041]},
        "dietary_preferences": ["vegetarian", "non-vegetarian"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_recv_003",
        "user_id": "usr_recv_003",
        "name": "Robin Hood Army — Delhi Chapter",
        "category": "food_bank",
        "sub_type": "Volunteer food redistribution network",
        "description": "Volunteer movement collecting surplus food from restaurants and distributing to slum communities.",
        "address": {"street": "Connaught Place", "city": "New Delhi", "zip": "110001"},
        "city": "New Delhi",
        "state": "Delhi",
        "contact_email": "delhi@robinhoodarmy.com",
        "contact_phone": "+91-98-1066-7788",
        "contact_person": "Neel Ghosh",
        "verified": True,
        "is_approved": True,
        "role": "receiver",
        "capacity_kg_per_day": 1200,
        "operating_hours": "10:00-22:00",
        "location": {"type": "Point", "coordinates": [77.216, 28.632]},
        "dietary_preferences": ["vegetarian", "non-vegetarian"],
        "created_at": utcnow(),
    },
    {
        "_id": "org_recv_004",
        "user_id": "usr_recv_004",
        "name": "Helpline Shelter — Chennai",
        "category": "shelter",
        "sub_type": "Urban homeless shelter",
        "description": "Residential shelter for 400 homeless individuals with daily meal services.",
        "address": {"street": "T. Nagar", "city": "Chennai", "zip": "600017"},
        "city": "Chennai",
        "state": "Tamil Nadu",
        "contact_email": "intake@helplineshelter.in",
        "contact_phone": "+91-44-2434-8900",
        "contact_person": "Thomas Antony",
        "verified": True,
        "is_approved": True,
        "role": "receiver",
        "capacity_kg_per_day": 400,
        "operating_hours": "00:00-23:59",
        "location": {"type": "Point", "coordinates": [80.234, 13.040]},
        "dietary_preferences": ["vegetarian", "non-vegetarian"],
        "created_at": utcnow(),
    },
]

FOOD_LISTINGS = [
    {
        "_id": "list_001",
        "donor_id": "org_donor_001",
        "title": "Banquet Vegetable Biryani — Post Wedding",
        "category": "cooked",
        "food_type": "Rice dish",
        "description": "120 kg of freshly prepared vegetable biryani from wedding reception. Prepared 2 hours ago, still warm. Safe for consumption for next 3 hours.",
        "is_vegetarian": "vegetarian",
        "allergens": "dairy",
        "quantity": 120.0,
        "unit": "kg",
        "servings": 300,
        "best_before": hours_from_now(3),
        "pickup_address": "Vakola, Santacruz East, Mumbai",
        "contact_person": "Priya Sharma",
        "contact_number": "+91-98765-43210",
        "special_instructions": "Bring insulated transport containers. Access via service gate B.",
        "state": "ACTIVE",
        "created_at": utcnow(),
        "location": {"type": "Point", "coordinates": [72.855, 19.082]},
    },
    {
        "_id": "list_002",
        "donor_id": "org_donor_002",
        "title": "South Indian Thali Surplus — Lunch Service",
        "category": "cooked",
        "food_type": "Mixed South Indian",
        "description": "50 kg of surplus thali meals (rice, sambar, rasam, 2 sabzis) from afternoon service. Vegan-friendly.",
        "is_vegetarian": "vegan",
        "allergens": None,
        "quantity": 50.0,
        "unit": "kg",
        "servings": 125,
        "best_before": hours_from_now(2),
        "pickup_address": "Koramangala 4th Block, Bengaluru",
        "contact_person": "Rajesh Kumar",
        "contact_number": "+91-91234-56789",
        "special_instructions": "Contact kitchen staff on arrival. Takeaway containers available.",
        "state": "ACTIVE",
        "created_at": utcnow(),
        "location": {"type": "Point", "coordinates": [77.627, 12.935]},
    },
    {
        "_id": "list_003",
        "donor_id": "org_donor_003",
        "title": "Near-Expiry Packaged Foods — Weekly Clearance",
        "category": "packaged",
        "food_type": "Dry goods and packaged snacks",
        "description": "200 kg of near-expiry (T+3 days) packaged goods: biscuits, chips, dry snacks, juices. All sealed.",
        "is_vegetarian": "vegetarian",
        "allergens": "gluten, nuts",
        "quantity": 200.0,
        "unit": "kg",
        "servings": 500,
        "best_before": hours_from_now(72),
        "pickup_address": "Phoenix Marketcity, Nagar Road, Pune",
        "contact_person": "Anjali Desai",
        "contact_number": "+91-87654-32109",
        "special_instructions": "Collect from receiving bay 4. Bring your own boxes.",
        "state": "ACTIVE",
        "created_at": utcnow(),
        "location": {"type": "Point", "coordinates": [73.941, 18.568]},
    },
    {
        "_id": "list_004",
        "donor_id": "org_donor_004",
        "title": "Fresh Vegetables — Overstock Clearance",
        "category": "raw",
        "food_type": "Mixed fresh vegetables",
        "description": "500 kg of fresh vegetables (tomatoes, onions, potatoes, leafy greens) from overstock. Ideal for community kitchens with cooking facilities.",
        "is_vegetarian": "vegan",
        "allergens": None,
        "quantity": 500.0,
        "unit": "kg",
        "servings": 1200,
        "best_before": hours_from_now(48),
        "pickup_address": "Turbhe MIDC, Navi Mumbai",
        "contact_person": "Vikram Singh",
        "contact_number": "+91-76543-21098",
        "special_instructions": "Refrigerated vehicle preferred. Available 07:00–11:00 only.",
        "state": "ACTIVE",
        "created_at": utcnow(),
        "location": {"type": "Point", "coordinates": [73.029, 19.071]},
    },
]

APPEALS = [
    {
        "_id": "app_001",
        "listing_id": "list_001",
        "receiver_id": "org_recv_002",
        "message": "We can deploy two vehicles within 30 minutes. Our kitchen can process up to 150 kg of cooked food tonight. Please confirm.",
        "status": "PENDING",
        "requested_at": utcnow(),
    },
    {
        "_id": "app_002",
        "listing_id": "list_002",
        "receiver_id": "org_recv_001",
        "message": "Akshaya Patra Bengaluru chapter can collect. Our cold chain vehicle is 15 min away from Koramangala.",
        "status": "ACCEPTED",
        "requested_at": utcnow() - timedelta(hours=1),
    },
    {
        "_id": "app_003",
        "listing_id": "list_003",
        "receiver_id": "org_recv_004",
        "message": "Packaged goods are perfect for our shelter residents. We have transport available this afternoon.",
        "status": "PENDING",
        "requested_at": utcnow(),
    },
]


async def seed() -> None:
    """Inserts demo data if collections are empty."""
    await connect(uri=settings.MONGODB_URI, db_name=settings.DATABASE_NAME)
    db = get_db()

    # Organizations
    if await db["organizations"].count_documents({}) == 0:
        result = await db["organizations"].insert_many(ORGANIZATIONS)
        logger.info(f"Inserted {len(result.inserted_ids)} organizations")
    else:
        logger.info("Organizations collection already populated — skipping")

    # Food listings
    if await db["food_listings"].count_documents({}) == 0:
        result = await db["food_listings"].insert_many(FOOD_LISTINGS)
        logger.info(f"Inserted {len(result.inserted_ids)} food listings")
    else:
        logger.info("Food listings already populated — skipping")

    # Appeals
    if await db["appeals"].count_documents({}) == 0:
        result = await db["appeals"].insert_many(APPEALS)
        logger.info(f"Inserted {len(result.inserted_ids)} appeals")
    else:
        logger.info("Appeals already populated — skipping")

    await disconnect()
    logger.info("Seed complete")


if __name__ == "__main__":
    asyncio.run(seed())

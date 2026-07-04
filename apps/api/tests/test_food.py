import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "foodbridge-api"}

def test_version_endpoint():
    response = client.get("/version")
    assert response.status_code == 200
    assert response.json()["version"] == "1.0.0"

def test_create_food_listing_validation():
    # Attempting to post missing required fields
    response = client.post("/api/v1/food", json={"title": "Veg Rice"})
    assert response.status_code == 422 # Unprocessable Entity validation error

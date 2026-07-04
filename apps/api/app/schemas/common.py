from pydantic import BaseModel, Field
from typing import Any, Dict, Optional

class HealthResponse(BaseModel):
    status: str = Field(default="healthy", example="healthy")
    service: str = Field(default="foodbridge-api", example="foodbridge-api")

class VersionResponse(BaseModel):
    version: str = Field(default="1.0.0", example="1.0.0")
    environment: str = Field(default="development", example="development")

class ErrorResponse(BaseModel):
    status: str = Field(default="error", example="error")
    code: str = Field(..., example="VALIDATION_ERROR")
    message: str = Field(..., example="Input parameters are invalid.")
    details: Optional[Dict[str, Any]] = Field(default=None)

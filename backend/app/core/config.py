from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "NASA Weather Dashboard API"
    api_version: str = "1.0.0"
    debug: bool = True
    
    # NASA API Configuration
    nasa_api_key: Optional[str] = None
    nasa_base_url: str = "https://power.larc.nasa.gov/api/v1"
    
    # CORS Configuration
    cors_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Database Configuration (if needed in future)
    database_url: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

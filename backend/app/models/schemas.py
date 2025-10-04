from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class WeatherCondition(str, Enum):
    VERY_HOT = "very-hot"
    VERY_COLD = "very-cold"
    VERY_WINDY = "very-windy"
    VERY_WET = "very-wet"
    POOR_AIR_QUALITY = "poor-air-quality"

class LocationInput(BaseModel):
    name: str
    lat: float = Field(..., ge=-90, le=90, description="Latitude between -90 and 90")
    lon: float = Field(..., ge=-180, le=180, description="Longitude between -180 and 180")
    method: str = Field(..., description="Method used to select location")

class TimeRange(BaseModel):
    start_date: Optional[str] = Field(None, description="Start date in YYYY-MM-DD format")
    end_date: Optional[str] = Field(None, description="End date in YYYY-MM-DD format")
    day_of_year: Optional[int] = Field(None, ge=1, le=365, description="Day of year (1-365)")

class Thresholds(BaseModel):
    temperature_hot: float = Field(default=90, description="Hot temperature threshold in Fahrenheit")
    temperature_cold: float = Field(default=32, description="Cold temperature threshold in Fahrenheit")
    wind_speed: float = Field(default=25, description="Wind speed threshold in mph")
    precipitation: float = Field(default=0.5, description="Precipitation threshold in inches per day")
    air_quality: float = Field(default=100, description="Air quality threshold (AQI)")

class WeatherQuery(BaseModel):
    location: LocationInput
    conditions: List[WeatherCondition]
    time_range: TimeRange
    thresholds: Thresholds = Field(default_factory=Thresholds)

class WeatherAnalysisResult(BaseModel):
    location: LocationInput
    conditions: List[WeatherCondition]
    probabilities: List[float] = Field(..., description="Probabilities for each condition (0-100%)")
    thresholds: Dict[str, Dict[str, Any]]
    metadata: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)

class DownloadRequest(BaseModel):
    format: str = Field(..., pattern="^(csv|json)$", description="Download format: csv or json")
    include_metadata: bool = Field(default=True, description="Include metadata in download")

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

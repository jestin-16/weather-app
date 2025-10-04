import httpx
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import math
from app.models.schemas import WeatherQuery, WeatherAnalysisResult, LocationInput, WeatherCondition
from app.core.config import settings

class NASAWeatherService:
    def __init__(self):
        self.api_key = settings.nasa_api_key or "DEMO_KEY"
        self.base_url = settings.nasa_base_url
        self.client = httpx.AsyncClient(timeout=30.0)

    async def analyze_weather_conditions(self, query: WeatherQuery) -> WeatherAnalysisResult:
        """
        Analyze weather conditions for a given location and time range.
        In a real implementation, this would call actual NASA APIs.
        """
        try:
            # Simulate API processing time
            await asyncio.sleep(1.5)
            
            # Generate realistic probability data based on location and conditions
            probabilities = self._generate_probabilities(
                query.location, 
                query.conditions, 
                query.thresholds
            )
            
            # Create metadata
            metadata = {
                "data_source": "NASA Earth Observation Data",
                "api_version": "v1.0",
                "analysis_timestamp": datetime.now().isoformat(),
                "location": {
                    "name": query.location.name,
                    "coordinates": {
                        "latitude": query.location.lat,
                        "longitude": query.location.lon
                    }
                },
                "analysis_parameters": {
                    "conditions": [condition.value for condition in query.conditions],
                    "thresholds": query.thresholds.dict(),
                    "time_range": query.time_range.dict()
                },
                "data_quality": "simulated",
                "units": {
                    "temperature": "Fahrenheit",
                    "wind_speed": "miles per hour",
                    "precipitation": "inches per day",
                    "air_quality": "Air Quality Index"
                }
            }
            
            # Create thresholds dict for response
            thresholds_dict = {}
            for condition in query.conditions:
                if condition == WeatherCondition.VERY_HOT:
                    thresholds_dict[condition.value] = {
                        "threshold": query.thresholds.temperature_hot,
                        "unit": "°F"
                    }
                elif condition == WeatherCondition.VERY_COLD:
                    thresholds_dict[condition.value] = {
                        "threshold": query.thresholds.temperature_cold,
                        "unit": "°F"
                    }
                elif condition == WeatherCondition.VERY_WINDY:
                    thresholds_dict[condition.value] = {
                        "threshold": query.thresholds.wind_speed,
                        "unit": "mph"
                    }
                elif condition == WeatherCondition.VERY_WET:
                    thresholds_dict[condition.value] = {
                        "threshold": query.thresholds.precipitation,
                        "unit": "in/day"
                    }
                elif condition == WeatherCondition.POOR_AIR_QUALITY:
                    thresholds_dict[condition.value] = {
                        "threshold": query.thresholds.air_quality,
                        "unit": "AQI"
                    }
            
            return WeatherAnalysisResult(
                location=query.location,
                conditions=query.conditions,
                probabilities=probabilities,
                thresholds=thresholds_dict,
                metadata=metadata,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            raise Exception(f"Failed to analyze weather conditions: {str(e)}")

    def _generate_probabilities(self, location: LocationInput, conditions: List[WeatherCondition], thresholds) -> List[float]:
        """
        Generate realistic probabilities based on location and conditions.
        """
        probabilities = []
        
        # Base probabilities influenced by location (latitude affects temperature extremes)
        lat_factor = abs(location.lat) / 90  # 0 to 1
        lon_factor = abs(location.lon) / 180  # 0 to 1
        
        for condition in conditions:
            base_probability = 0
            
            if condition == WeatherCondition.VERY_HOT:
                # Higher probability in lower latitudes and summer months
                base_probability = (1 - lat_factor) * 0.4 + random.random() * 0.3
            elif condition == WeatherCondition.VERY_COLD:
                # Higher probability in higher latitudes and winter months
                base_probability = lat_factor * 0.4 + random.random() * 0.3
            elif condition == WeatherCondition.VERY_WINDY:
                # Coastal areas and mountainous regions tend to be windier
                base_probability = 0.2 + random.random() * 0.4
            elif condition == WeatherCondition.VERY_WET:
                # Tropical and coastal areas have higher precipitation
                base_probability = (1 - lat_factor) * 0.3 + random.random() * 0.3
            elif condition == WeatherCondition.POOR_AIR_QUALITY:
                # Urban areas and certain geographic regions
                base_probability = 0.1 + random.random() * 0.3
            else:
                base_probability = random.random() * 0.5
            
            # Add some randomness and ensure reasonable ranges
            probability = min(95, max(5, round(base_probability * 100)))
            probabilities.append(probability)
        
        return probabilities

    async def get_available_parameters(self) -> Dict[str, Any]:
        """
        Get available weather parameters from NASA API.
        """
        try:
            # In a real implementation, this would call NASA's parameter list API
            return {
                "temperature": {
                    "parameters": ["T2M", "T2M_MAX", "T2M_MIN"],
                    "description": "Air temperature at 2 meters above ground",
                    "units": "Celsius"
                },
                "precipitation": {
                    "parameters": ["PRECTOT", "PRECTOTCORR"],
                    "description": "Total precipitation",
                    "units": "mm/day"
                },
                "wind": {
                    "parameters": ["WS2M", "WS10M", "WS50M"],
                    "description": "Wind speed at various heights",
                    "units": "m/s"
                },
                "air_quality": {
                    "parameters": ["AOD", "DUST"],
                    "description": "Aerosol optical depth and dust concentration",
                    "units": "dimensionless"
                }
            }
        except Exception as e:
            raise Exception(f"Failed to fetch available parameters: {str(e)}")

    async def get_historical_data(self, location: LocationInput, parameter: str, 
                                start_date: str, end_date: str) -> Dict[str, Any]:
        """
        Get historical data for a specific location and parameter.
        """
        try:
            params = {
                "request": "execute",
                "identifier": parameter,
                "parameters": parameter,
                "startDate": start_date,
                "endDate": end_date,
                "userCommunity": "SSE",
                "tempAverage": "DAILY",
                "outputList": "JSON",
                "lat": location.lat,
                "lon": location.lon,
                "user": self.api_key
            }
            
            response = await self.client.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            raise Exception(f"Failed to fetch historical weather data: {str(e)}")

    def calculate_statistics(self, data: List[float], threshold: float) -> Dict[str, float]:
        """
        Calculate statistics for a given dataset.
        """
        if not data or len(data) == 0:
            return {
                "mean": 0,
                "median": 0,
                "standard_deviation": 0,
                "probability_above_threshold": 0,
                "probability_below_threshold": 0,
                "min": 0,
                "max": 0,
                "count": 0
            }

        sorted_data = sorted(data)
        mean = sum(data) / len(data)
        median = sorted_data[len(sorted_data) // 2]
        
        variance = sum((value - mean) ** 2 for value in data) / len(data)
        standard_deviation = math.sqrt(variance)
        
        above_threshold = sum(1 for value in data if value > threshold)
        probability_above_threshold = (above_threshold / len(data)) * 100
        probability_below_threshold = 100 - probability_above_threshold

        return {
            "mean": mean,
            "median": median,
            "standard_deviation": standard_deviation,
            "probability_above_threshold": probability_above_threshold,
            "probability_below_threshold": probability_below_threshold,
            "min": min(data),
            "max": max(data),
            "count": len(data)
        }

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

# Global instance
nasa_service = NASAWeatherService()

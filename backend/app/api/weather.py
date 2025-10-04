from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import Dict, Any
import json
import csv
import io
from datetime import datetime

from app.models.schemas import (
    WeatherQuery, 
    WeatherAnalysisResult, 
    DownloadRequest,
    ErrorResponse
)
from app.services.nasa_service import nasa_service

router = APIRouter()

@router.post("/analyze", response_model=WeatherAnalysisResult)
async def analyze_weather_conditions(query: WeatherQuery):
    """
    Analyze weather conditions for a given location and time range.
    
    This endpoint takes a weather query with location, conditions, and thresholds,
    and returns probability analysis for adverse weather conditions.
    """
    try:
        result = await nasa_service.analyze_weather_conditions(query)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze weather conditions: {str(e)}"
        )

@router.get("/parameters")
async def get_available_parameters():
    """
    Get available weather parameters from NASA API.
    
    Returns information about available weather data parameters
    that can be used for analysis.
    """
    try:
        parameters = await nasa_service.get_available_parameters()
        return {
            "parameters": parameters,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch available parameters: {str(e)}"
        )

@router.post("/download/csv")
async def download_csv(query: WeatherQuery):
    """
    Download weather analysis results as CSV format.
    
    Returns a CSV file containing the weather analysis results
    with metadata and proper formatting.
    """
    try:
        # Get analysis results
        result = await nasa_service.analyze_weather_conditions(query)
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow([
            'Condition', 'Probability (%)', 'Threshold', 'Unit', 'Risk Level',
            'Location', 'Latitude', 'Longitude', 'Analysis Date'
        ])
        
        # Write data rows
        for i, condition in enumerate(result.conditions):
            probability = result.probabilities[i]
            threshold_info = result.thresholds.get(condition.value, {})
            risk_level = "High" if probability >= 70 else "Medium" if probability >= 40 else "Low"
            
            writer.writerow([
                condition.value.replace('-', ' ').title(),
                probability,
                threshold_info.get('threshold', 'N/A'),
                threshold_info.get('unit', 'N/A'),
                risk_level,
                result.location.name,
                result.location.lat,
                result.location.lon,
                result.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        # Create filename
        filename = f"weather_analysis_{result.location.name.replace(' ', '_')}_{result.timestamp.strftime('%Y%m%d')}.csv"
        
        # Return CSV as streaming response
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate CSV download: {str(e)}"
        )

@router.post("/download/json")
async def download_json(query: WeatherQuery):
    """
    Download weather analysis results as JSON format.
    
    Returns a JSON file containing the complete weather analysis results
    with metadata and detailed information.
    """
    try:
        # Get analysis results
        result = await nasa_service.analyze_weather_conditions(query)
        
        # Create comprehensive JSON data
        json_data = {
            "metadata": {
                "timestamp": result.timestamp.isoformat(),
                "data_source": "NASA Earth Observation Data",
                "api_version": "v1.0",
                "location": {
                    "name": result.location.name,
                    "coordinates": {
                        "latitude": result.location.lat,
                        "longitude": result.location.lon
                    }
                },
                "units": {
                    "temperature": "Fahrenheit",
                    "wind_speed": "miles per hour",
                    "precipitation": "inches per day",
                    "air_quality": "Air Quality Index"
                }
            },
            "analysis": {
                "conditions": [
                    {
                        "condition": condition.value.replace('-', ' ').title(),
                        "probability": result.probabilities[i],
                        "threshold": result.thresholds.get(condition.value, {}).get('threshold'),
                        "unit": result.thresholds.get(condition.value, {}).get('unit'),
                        "risk_level": "High" if result.probabilities[i] >= 70 else "Medium" if result.probabilities[i] >= 40 else "Low"
                    }
                    for i, condition in enumerate(result.conditions)
                ],
                "summary": {
                    "total_conditions": len(result.conditions),
                    "high_risk_conditions": sum(1 for p in result.probabilities if p >= 70),
                    "medium_risk_conditions": sum(1 for p in result.probabilities if 40 <= p < 70),
                    "low_risk_conditions": sum(1 for p in result.probabilities if p < 40),
                    "overall_risk_level": "High" if any(p >= 70 for p in result.probabilities) else 
                                        "Medium" if any(40 <= p < 70 for p in result.probabilities) else "Low"
                }
            },
            "query_parameters": {
                "conditions": [c.value for c in result.conditions],
                "thresholds": result.thresholds,
                "time_range": query.time_range.dict()
            }
        }
        
        # Create filename
        filename = f"weather_analysis_{result.location.name.replace(' ', '_')}_{result.timestamp.strftime('%Y%m%d')}.json"
        
        # Return JSON as streaming response
        json_str = json.dumps(json_data, indent=2)
        return StreamingResponse(
            io.BytesIO(json_str.encode('utf-8')),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate JSON download: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """
    Health check endpoint for the weather service.
    
    Returns the current status of the weather analysis service.
    """
    return {
        "status": "healthy",
        "service": "weather-analysis",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

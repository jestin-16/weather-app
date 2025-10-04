# NASA Weather Dashboard Backend

A FastAPI backend service for the NASA Weather Dashboard application that provides weather analysis using NASA Earth observation data.

## Features

- **Weather Analysis API**: Analyze weather conditions for specific locations and time ranges
- **Multiple Data Formats**: Support for CSV and JSON data downloads
- **NASA Integration**: Integration with NASA Earth observation data APIs
- **CORS Support**: Configured for frontend integration
- **Comprehensive Documentation**: Auto-generated API documentation with Swagger UI

## Installation

1. **Install Python Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables**:
   ```bash
   cp env.example .env
   # Edit .env file with your NASA API key and other configurations
   ```

3. **Run the Application**:
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Weather Analysis
- `POST /api/v1/analyze` - Analyze weather conditions for a location
- `GET /api/v1/parameters` - Get available weather parameters
- `POST /api/v1/download/csv` - Download analysis results as CSV
- `POST /api/v1/download/json` - Download analysis results as JSON
- `GET /api/v1/health` - Health check endpoint

### Documentation
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

## API Usage Examples

### Analyze Weather Conditions
```python
import requests

query = {
    "location": {
        "name": "New York City",
        "lat": 40.7128,
        "lon": -74.0060,
        "method": "search"
    },
    "conditions": ["very-hot", "very-windy"],
    "time_range": {
        "start_date": "2024-01-01",
        "end_date": "2024-12-31"
    },
    "thresholds": {
        "temperature_hot": 90,
        "wind_speed": 25
    }
}

response = requests.post("http://localhost:8000/api/v1/analyze", json=query)
result = response.json()
```

### Download CSV Data
```python
response = requests.post("http://localhost:8000/api/v1/download/csv", json=query)
with open("weather_analysis.csv", "wb") as f:
    f.write(response.content)
```

## Configuration

The application uses environment variables for configuration:

- `NASA_API_KEY`: Your NASA API key (optional, uses demo key if not provided)
- `DEBUG`: Enable debug mode (default: True)
- `CORS_ORIGINS`: Allowed CORS origins (default: localhost:3000)

## Development

### Project Structure
```
backend/
├── app/
│   ├── api/           # API routes and endpoints
│   ├── core/          # Core configuration and settings
│   ├── models/        # Pydantic models and schemas
│   └── services/      # Business logic and external services
├── main.py            # FastAPI application entry point
├── requirements.txt   # Python dependencies
└── env.example        # Environment variables template
```

### Adding New Endpoints
1. Create new route files in `app/api/`
2. Define Pydantic models in `app/models/schemas.py`
3. Implement business logic in `app/services/`
4. Register routes in `main.py`

## Testing

The API can be tested using:
- Swagger UI at `http://localhost:8000/docs`
- ReDoc at `http://localhost:8000/redoc`
- Direct HTTP requests using curl, Postman, or Python requests

## Deployment

For production deployment:
1. Set `DEBUG=False` in environment variables
2. Configure proper CORS origins
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Set up proper logging and monitoring

## License

This project is part of the NASA Weather Dashboard application.

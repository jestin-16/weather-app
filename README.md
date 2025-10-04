# NASA Weather Dashboard

A comprehensive weather analysis application that uses NASA Earth observation data to help users plan outdoor activities by analyzing the likelihood of adverse weather conditions.

## 🌟 Features

### Frontend (React)

- **Interactive Location Selection**: Search by name, enter coordinates, or use map interface
- **Customizable Weather Analysis**: Select specific weather conditions and set thresholds
- **Real-time Data Visualization**: Charts and graphs showing weather probabilities
- **Data Export**: Download analysis results in CSV or JSON formats
- **Responsive Design**: Modern, mobile-friendly interface

### Backend (FastAPI)

- **RESTful API**: Comprehensive weather analysis endpoints
- **NASA Integration**: Integration with NASA Earth observation data APIs
- **Data Processing**: Statistical analysis and probability calculations
- **File Downloads**: Server-side generation of CSV and JSON exports
- **CORS Support**: Configured for seamless frontend integration
- **Auto Documentation**: Swagger UI and ReDoc documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd weather-check
   ```

2. **Start the Backend**:

   ```bash
   cd backend
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your NASA API key (optional)
   python main.py
   ```

   The backend will be available at `http://localhost:8000`

   - API Documentation: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

3. **Start the Frontend** (in a new terminal):

   ```bash
   npm install
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
weather-check/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration
│   │   ├── models/          # Pydantic models
│   │   └── services/        # Business logic
│   ├── main.py             # FastAPI app entry point
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/           # API services
│   └── ...
├── public/                 # Static assets
└── README.md               # This file
```

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://power.larc.nasa.gov/api/v1

# API Configuration
DEBUG=True
API_TITLE="NASA Weather Dashboard API"

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### Frontend Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📊 API Endpoints

### Weather Analysis

- `POST /api/v1/analyze` - Analyze weather conditions
- `GET /api/v1/parameters` - Get available weather parameters
- `POST /api/v1/download/csv` - Download CSV data
- `POST /api/v1/download/json` - Download JSON data
- `GET /api/v1/health` - Health check

### Example API Usage

```python
import requests

# Analyze weather conditions
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

## 🎯 Usage Guide

1. **Select Location**: Choose your location using search, coordinates, or map
2. **Configure Analysis**: Select weather conditions and set thresholds
3. **View Results**: Get probability analysis with visualizations
4. **Download Data**: Export results in CSV or JSON format

## 🌦️ Weather Conditions Analyzed

- **Very Hot**: Extreme heat conditions above specified temperature
- **Very Cold**: Extreme cold conditions below specified temperature
- **Very Windy**: High wind speed conditions above threshold
- **Very Wet**: Heavy precipitation conditions above threshold
- **Poor Air Quality**: Unhealthy air quality conditions above AQI threshold

## 🔬 Data Sources

This application integrates with NASA Earth observation data, including:

- Temperature data from various NASA missions
- Precipitation measurements
- Wind speed and direction data
- Air quality and aerosol data

## 🛠️ Development

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development

```bash
npm install
npm start
```

### Testing

- Backend: Use Swagger UI at `http://localhost:8000/docs`
- Frontend: Automated tests with Jest and React Testing Library

## 📝 License

This project is part of the NASA Weather Dashboard application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:

- Check the API documentation at `/docs`
- Review the backend README in `backend/README.md`
- Open an issue in the repository

## 🔮 Future Enhancements

- Real-time weather data integration
- Historical weather trend analysis
- Machine learning predictions
- Mobile app development
- Advanced mapping features
- Weather alerts and notifications

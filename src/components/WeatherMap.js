import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Layers, Thermometer, Droplets, Wind, Eye, Zap } from 'lucide-react';
import weatherService from '../services/weatherService';

const WeatherMap = ({ selectedLocation, onLocationSelect, darkMode }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [zoom, setZoom] = useState(10);
  const [mapLayers, setMapLayers] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherMarkers, setWeatherMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);

  // Update map center when location changes
  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.lat, selectedLocation.lon]);
      setZoom(12);
    }
  }, [selectedLocation]);

  // Load weather data for multiple locations
  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      // Sample locations for demonstration
      const sampleLocations = [
        { lat: 40.7128, lon: -74.0060, name: 'New York' },
        { lat: 51.5074, lon: -0.1278, name: 'London' },
        { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
        { lat: 48.8566, lon: 2.3522, name: 'Paris' },
        { lat: -33.8688, lon: 151.2093, name: 'Sydney' }
      ];

      const weatherData = await weatherService.getMultipleLocationWeather(sampleLocations);
      setWeatherMarkers(weatherData);
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map click handler for react-leaflet
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const [current, forecast, mlPrediction] = await Promise.all([
            weatherService.getCurrentWeather(lat, lng),
            weatherService.getWeatherForecast(lat, lng),
            weatherService.getMLWeatherPrediction(lat, lng, 3)
          ]);
          const newMarker = {
            id: `marker_${Date.now()}`,
            location: { lat, lon: lng, name: `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}` },
            current,
            forecast,
            mlPrediction,
            timestamp: new Date().toISOString()
          };
          setWeatherMarkers(prev => [...prev, newMarker]);
          setSelectedMarker(newMarker);
          onLocationSelect({
            method: 'map',
            lat,
            lon: lng,
            name: newMarker.location.name
          });
        } catch (error) {
          console.error('Error fetching weather for clicked location:', error);
        }
      }
    });
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
          setMapCenter(coords);
          setZoom(4); // World view zoom

          // Get weather data for searched location
          const [current, forecast, mlPrediction] = await Promise.all([
            weatherService.getCurrentWeather(coords[0], coords[1]),
            weatherService.getWeatherForecast(coords[0], coords[1]),
            weatherService.getMLWeatherPrediction(coords[0], coords[1], 3)
          ]);

          const newMarker = {
            id: `search_${Date.now()}`,
            location: { lat: coords[0], lon: coords[1], name: searchQuery },
            current,
            forecast,
            mlPrediction,
            timestamp: new Date().toISOString()
          };

          setWeatherMarkers(prev => [...prev, newMarker]);
          setSelectedMarker(newMarker);

          onLocationSelect({
            method: 'search',
            lat: coords[0],
            lon: coords[1],
            name: searchQuery
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        alert('Error searching for location. Please try again.');
      }
    }
  };

  const geocodeLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return [parseFloat(result.lat), parseFloat(result.lon)];
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Storm': '⛈️',
      'Fog': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const layerOptions = [
    { id: 'satellite', name: 'Satellite', icon: '🛰️' },
    { id: 'terrain', name: 'Terrain', icon: '🏔️' },
    { id: 'street', name: 'Street', icon: '🛣️' },
    { id: 'weather', name: 'Weather', icon: '🌦️' }
  ];

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for any location worldwide..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Layer Selection */}
          <div className="flex gap-2">
            {layerOptions.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setMapLayers(layer.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  mapLayers === layer.id
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{layer.icon}</span>
                <span className="hidden sm:inline">{layer.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative h-96 lg:h-[500px]">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {/* Weather Markers */}
            {weatherMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.location.lat, marker.location.lon]}
                icon={L.divIcon({
                  className: '',
                  html: `<div style="background:${
                    marker.current.temperature > 30 ? '#ef4444' :
                    marker.current.temperature > 20 ? '#f59e42' :
                    marker.current.temperature > 10 ? '#facc15' :
                    marker.current.temperature > 0 ? '#3b82f6' : '#a21caf'
                  };width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;border-radius:50%;border:4px solid #fff;box-shadow:0 2px 8px #0002;font-size:1.5rem;">${getWeatherIcon(marker.current.condition)}</div><div style="position:absolute;left:50%;transform:translateX(-50%);top:2.5rem;background:#fff;color:#000;font-size:0.8rem;padding:2px 8px;border-radius:4px;font-weight:bold;box-shadow:0 2px 8px #0001;">${marker.current.temperature}°C</div>`
                })}
                eventHandlers={{
                  click: () => setSelectedMarker(marker)
                }}
              >
                <Popup>
                  <div className="text-sm font-medium mb-2">{marker.location.name}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <Thermometer size={12} />
                      <span>{marker.current.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets size={12} />
                      <span>{marker.current.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind size={12} />
                      <span>{marker.current.windSpeed} m/s</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye size={12} />
                      <span>{marker.current.visibility} km</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-[1000]">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setZoom(Math.min(zoom + 1, 20))}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
              >
                +
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 1, 1))}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
              >
                −
              </button>
            </div>
          </div>
          {/* Coordinates Display */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
            <div className="text-sm font-mono">
              <div>Lat: {mapCenter[0].toFixed(4)}</div>
              <div>Lon: {mapCenter[1].toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Marker Details */}
      {selectedMarker && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedMarker.location.name}
            </h3>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Weather */}
            <div className="space-y-4">
              <h4 className={`text-lg font-medium transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Current Weather
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Thermometer className="text-blue-500" size={16} />
                    <span>Temperature</span>
                  </span>
                  <span className="font-bold">{selectedMarker.current.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Droplets className="text-blue-500" size={16} />
                    <span>Humidity</span>
                  </span>
                  <span className="font-bold">{selectedMarker.current.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Wind className="text-blue-500" size={16} />
                    <span>Wind Speed</span>
                  </span>
                  <span className="font-bold">{selectedMarker.current.windSpeed} m/s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Eye className="text-blue-500" size={16} />
                    <span>Visibility</span>
                  </span>
                  <span className="font-bold">{selectedMarker.current.visibility} km</span>
                </div>
              </div>
            </div>

            {/* ML Predictions */}
            <div className="space-y-4">
              <h4 className={`text-lg font-medium transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ML Predictions
              </h4>
              <div className="space-y-2">
                {selectedMarker.mlPrediction.predictions.slice(0, 3).map((prediction, index) => (
                  <div key={index} className={`p-3 rounded-lg border transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {prediction.date.toLocaleDateString()}
                      </span>
                      <span className={`text-sm font-bold ${getRiskColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel} Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>{prediction.temperature}°C</span>
                      <span>{prediction.condition}</span>
                      <span className="text-xs text-gray-500">
                        {(prediction.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="space-y-4">
              <h4 className={`text-lg font-medium transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                5-Day Forecast
              </h4>
              <div className="space-y-2">
                {selectedMarker.forecast.slice(0, 5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-sm">
                      {day.datetime.toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getWeatherIcon(day.condition)}</span>
                      <span className="text-sm font-bold">{day.temperature}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Weather Map Legend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Hot Weather (&gt;30°C)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Warm Weather (20-30°C)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Mild Weather (10-20°C)
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cool Weather (0-10°C)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cold Weather (&lt;0°C)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Click to add weather marker
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;

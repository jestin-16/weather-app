import React, { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

const LocationSelector = ({ onLocationSelect, selectedLocation, darkMode, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        // Try real geocoding first
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
          onLocationSelect({
            method: 'search',
            query: searchQuery,
            name: searchQuery,
            lat: coords[0],
            lon: coords[1]
          });
        } else {
          // Fallback to mock data for demo purposes
          const mockCoordinates = {
            'new york': [40.7128, -74.0060],
            'london': [51.5074, -0.1278],
            'tokyo': [35.6762, 139.6503],
            'paris': [48.8566, 2.3522],
            'sydney': [-33.8688, 151.2093],
            'moscow': [55.7558, 37.6176],
            'beijing': [39.9042, 116.4074],
            'mumbai': [19.0760, 72.8777]
          };

          const mockCoords = mockCoordinates[searchQuery.toLowerCase()];
          if (mockCoords) {
            onLocationSelect({
              method: 'search',
              query: searchQuery,
              name: searchQuery,
              lat: mockCoords[0],
              lon: mockCoords[1]
            });
          } else {
            alert('Location not found. Try: New York, London, Tokyo, Paris, Sydney, Moscow, Beijing, or Mumbai.');
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        alert('Error searching for location. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Real geocoding function using OpenStreetMap Nominatim API
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

  const handleMapClick = (lat, lon) => {
    onLocationSelect({
      method: 'map',
      lat,
      lon,
      name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities worldwide..."
            className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            }`}
          />
          <button
            type="submit"
            disabled={isSearching}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-300 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50' 
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Search size={20} />
            )}
          </button>
        </form>
        
        {isLoading && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-600"></div>
            <span className={`ml-2 text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Analyzing...
            </span>
          </div>
        )}
      </div>

      {/* Alternative Input Methods */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleMapClick(40.7128, -74.0060)}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="mr-2" size={16} />
          Use Map
        </button>
        <button
          onClick={() => {
            const lat = (Math.random() * 180 - 90).toFixed(4);
            const lon = (Math.random() * 360 - 180).toFixed(4);
            handleMapClick(parseFloat(lat), parseFloat(lon));
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Navigation className="mr-2" size={16} />
          Random Location
        </button>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-green-300' : 'text-green-800'
              }`}>
                <strong>Selected:</strong> {selectedLocation.name}
              </p>
              <p className={`text-xs transition-colors duration-300 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-200 border-t-green-600"></div>
                <span className={`ml-2 text-xs transition-colors duration-300 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  Analyzing...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
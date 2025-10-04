import React, { useState } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';

const LocationSelector = ({ onLocationSelect, selectedLocation, darkMode }) => {
  const [inputMethod, setInputMethod] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real implementation, this would use a geocoding service
      onLocationSelect({
        method: 'search',
        query: searchQuery,
        name: searchQuery,
        lat: 40.7128, // Placeholder coordinates for NYC
        lon: -74.0060
      });
    }
  };

  const handleCoordinateSubmit = (e) => {
    e.preventDefault();
    if (coordinates.lat && coordinates.lon) {
      onLocationSelect({
        method: 'coordinates',
        lat: parseFloat(coordinates.lat),
        lon: parseFloat(coordinates.lon),
        name: `${coordinates.lat}, ${coordinates.lon}`
      });
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
    <div className={`rounded-xl shadow-lg p-6 mb-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <MapPin className="mr-2 text-blue-600" />
        Select Location
      </h2>
      
      {/* Input Method Selection */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setInputMethod('search')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMethod === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Search className="inline mr-1" size={16} />
          Search
        </button>
        <button
          onClick={() => setInputMethod('coordinates')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMethod === 'coordinates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Navigation className="inline mr-1" size={16} />
          Coordinates
        </button>
        <button
          onClick={() => setInputMethod('map')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMethod === 'map'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="inline mr-1" size={16} />
          Map
        </button>
      </div>

      {/* Search Input */}
      {inputMethod === 'search' && (
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Location Name
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter city, state, or landmark..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search Location
          </button>
        </form>
      )}

      {/* Coordinate Input */}
      {inputMethod === 'coordinates' && (
        <form onSubmit={handleCoordinateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lat}
                onChange={(e) => setCoordinates({ ...coordinates, lat: e.target.value })}
                placeholder="e.g., 40.7128"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lon}
                onChange={(e) => setCoordinates({ ...coordinates, lon: e.target.value })}
                placeholder="e.g., -74.0060"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Use Coordinates
          </button>
        </form>
      )}

      {/* Map Placeholder */}
      {inputMethod === 'map' && (
        <div className="space-y-4">
          <div className={`rounded-lg h-64 flex items-center justify-center border-2 border-dashed transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-100 border-gray-300'
          }`}>
            <div className="text-center">
              <MapPin className={`mx-auto mb-2 transition-colors duration-300 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`} size={48} />
              <p className={`transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Interactive map will be implemented here
              </p>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Click to select location
              </p>
            </div>
          </div>
          <button
            onClick={() => handleMapClick(40.7128, -74.0060)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Use Sample Location (NYC)
          </button>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className={`mt-4 p-3 rounded-md border transition-colors duration-300 ${
          darkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
        }`}>
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
      )}
    </div>
  );
};

export default LocationSelector;

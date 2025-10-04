import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, Navigation, Layers } from 'lucide-react';

const InteractiveMap = ({ selectedLocation, onLocationSelect, darkMode }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // NYC default
  const [zoom, setZoom] = useState(10);
  const [mapLayers, setMapLayers] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  // Update map center when location changes
  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.lat, selectedLocation.lon]);
      setZoom(12);
    }
  }, [selectedLocation]);

  const handleMapClick = (event) => {
    // Simulate map click coordinates
    const lat = mapCenter[0] + (Math.random() - 0.5) * 0.1;
    const lon = mapCenter[1] + (Math.random() - 0.5) * 0.1;
    
    onLocationSelect({
      method: 'map',
      lat,
      lon,
      name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simulate geocoding
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

      const coords = mockCoordinates[searchQuery.toLowerCase()];
      if (coords) {
        setMapCenter(coords);
        setZoom(12);
        onLocationSelect({
          method: 'search',
          lat: coords[0],
          lon: coords[1],
          name: searchQuery,
          query: searchQuery
        });
      }
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
                  placeholder="Search for a location..."
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
          {/* Map Placeholder with Interactive Elements */}
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 relative cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Map Grid */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 5}%` }}></div>
              ))}
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }}></div>
              ))}
            </div>

            {/* Map Center Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-red-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>

            {/* Selected Location Marker */}
            {selectedLocation && (
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + (selectedLocation.lat - mapCenter[0]) * 1000}%`,
                  top: `${50 + (selectedLocation.lon - mapCenter[1]) * 1000}%`
                }}
              >
                <div className="relative">
                  <MapPin className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {selectedLocation.name}
                  </div>
                </div>
              </div>
            )}

            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Layers className="text-gray-600" size={16} />
                <span className="font-medium">{layerOptions.find(l => l.id === mapLayers)?.name} View</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Zoom: {zoom}x • Click to select location
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-mono">
                <div>Lat: {mapCenter[0].toFixed(4)}</div>
                <div>Lon: {mapCenter[1].toFixed(4)}</div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
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
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Map Legend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Map Center
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Selected Location
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Vegetation Areas
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Water Bodies
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;

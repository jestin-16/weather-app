import React, { useState } from 'react';
import './App.css';
import LocationSelector from './components/LocationSelector';
import WeatherQuery from './components/WeatherQuery';
import ResultsDisplay from './components/ResultsDisplay';
import DataDownload from './components/DataDownload';
import nasaWeatherService from './services/nasaWeatherService';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setQueryResults(null); // Clear previous results when location changes
    setError(null);
  };

  const handleQuerySubmit = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await nasaWeatherService.analyzeWeatherConditions(query);
      setQueryResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (data) => {
    // This will be handled by the DataDownload component
    console.log('Download requested for:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🌦️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NASA Weather Dashboard</h1>
                <p className="text-sm text-gray-600">Personalized weather analysis for outdoor activities</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Powered by NASA Earth Observation Data
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            <LocationSelector 
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
            />
            
            {selectedLocation && (
              <WeatherQuery 
                onQuerySubmit={handleQuerySubmit}
                selectedLocation={selectedLocation}
              />
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {isLoading && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Analyzing weather conditions...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && (
              <>
                <ResultsDisplay 
                  queryResults={queryResults}
                  onDownload={handleDownload}
                />
                
                {queryResults && (
                  <DataDownload 
                    queryResults={queryResults}
                    onDownload={handleDownload}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        {!selectedLocation && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use This Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-medium text-gray-700 mb-2">1. Select Location</h3>
                <p className="text-sm text-gray-600">Choose your location by searching, entering coordinates, or clicking on a map.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-medium text-gray-700 mb-2">2. Configure Analysis</h3>
                <p className="text-sm text-gray-600">Select weather conditions and set thresholds for your specific needs.</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-medium text-gray-700 mb-2">3. View Results</h3>
                <p className="text-sm text-gray-600">Get probability analysis and download data for further use.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>This application uses NASA Earth observation data for weather analysis.</p>
            <p className="mt-1">Data is for informational purposes only. Always check real-time weather forecasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

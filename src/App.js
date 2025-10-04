import React, { useState, useEffect } from 'react';
import './App.css';
import LocationSelector from './components/LocationSelector';
import ResultsDisplay from './components/ResultsDisplay';
import InteractiveMap from './components/InteractiveMap';
import ThemeToggle from './components/ThemeToggle';
import weatherService from './services/weatherService';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mlResults, setMlResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setMlResults(null);
    setError(null);
    setIsLoading(true);
    console.log('[App] Location selected:', location);
    try {
      console.log('[App] Calling ML prediction API...');
      const mlPrediction = await weatherService.getMLWeatherPrediction(location.lat, location.lon, 7);
      console.log('[App] ML prediction API response:', mlPrediction);

      // Check if mlPrediction is an array or object and log its structure
      if (Array.isArray(mlPrediction)) {
        console.log('[App] ML prediction is an array. Passing directly to ResultsDisplay.');
        setMlResults(mlPrediction);
      } else if (mlPrediction && Array.isArray(mlPrediction.predictions)) {
        console.log('[App] ML prediction is an object with predictions array. Passing predictions to ResultsDisplay.');
        setMlResults(mlPrediction.predictions);
      } else {
        console.error('[App] ML prediction format is invalid:', mlPrediction);
        setError('ML prediction format is invalid.');
      }
    } catch (err) {
      console.error('[App] Failed to get ML prediction:', err);
      setError('Failed to get ML prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (data) => {
    console.log('Download requested for:', data);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className={`relative backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-bounce">🌦️</div>
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  NASA Weather Dashboard
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  AI-powered global weather prediction for any location
                </p>
              </div>
            </div>
            <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      {/* Unified Main Content: Map, Search, Results */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Map and Search (combined) */}
          <InteractiveMap
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            darkMode={darkMode}
          />

          {/* Results */}
          <div>
            {isLoading && (
              <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl">🌦️</div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Predicting Weather (AI Model)
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Running ML model for selected location...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
                darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
              } border`}>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-red-300' : 'text-red-800'
                    }`}>
                      ML Prediction Error
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-red-400' : 'text-red-700'
                    }`}>
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && mlResults && (
              <>
                {console.log('[App] Passing to ResultsDisplay:', mlResults)}
                <ResultsDisplay 
                  queryResults={mlResults}
                  onDownload={handleDownload}
                  darkMode={darkMode}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative border-t mt-16 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="text-2xl">🌦️</div>
              <div className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                NASA Weather Dashboard
              </div>
            </div>
            <p className={`text-sm transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Powered by NASA Earth observation data • Built with React & FastAPI
            </p>
            <p className={`text-xs mt-2 transition-colors duration-300 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Data is for informational purposes only. Always check real-time weather forecasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

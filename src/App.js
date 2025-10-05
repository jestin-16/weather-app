import React, { useState, useEffect } from 'react';
import './App.css';
import ResultsDisplay from './components/ResultsDisplay';
import InteractiveMap from './components/InteractiveMap';
import ThemeToggle from './components/ThemeToggle';
import { getWeatherForecast } from './services/weatherApiService';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  // Handle location selection from map
  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setForecastData(null);
    setAvailableDates([]);
    setStartDate('');
    setEndDate('');
    setMlResults(null);
    setError(null);
    setIsLoading(true);

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('Missing OpenWeatherMap API key.');
      setIsLoading(false);
      return;
    }

    try {
      const forecast = await getWeatherForecast(location.lat, location.lon, apiKey);

      // Extract unique available dates from forecast
      const dates = Array.from(
        new Set(forecast.list.map(item => item.dt_txt.slice(0, 10)))
      );
      setForecastData(forecast);
      setAvailableDates(dates);
      setStartDate(dates[0]);
      setEndDate(dates[dates.length - 1]);
    } catch (err) {
      console.error('[App] Failed to get weather data:', err);
      setError('Failed to get weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  // When date range changes, filter and analyze forecast
  useEffect(() => {
    if (!forecastData || !startDate || !endDate) {
      setMlResults(null);
      return;
    }
    const filtered = forecastData.list.filter(item => {
      const itemDate = item.dt_txt.slice(0, 10);
      return itemDate >= startDate && itemDate <= endDate;
    });

    const results = filtered.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      humidity: item.main.humidity,
      pressure: item.main.pressure ?? '-',
      windspeed: item.wind.speed,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0,
      veryHot: item.main.temp > 32,
      veryCold: item.main.temp < 5,
      veryWindy: item.wind.speed > 10,
      veryWet: (item.rain ? item.rain['3h'] || 0 : 0) > 10,
      veryUncomfortable: item.main.humidity > 80 && item.main.temp > 28,
      condition: item.weather[0]?.main || '',
    }));

    setMlResults(results);
  }, [forecastData, startDate, endDate]);

  const handleDownload = (data) => {
    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather_results.json';
    a.click();
    URL.revokeObjectURL(url);
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

      {/* Main Content */}
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Step 1: Location Selection */}
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>1. Select a Location</h2>
            <InteractiveMap
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              darkMode={darkMode}
              hideLayerControls={true} // Pass this prop to hide map layer controls
            />
          </div>

          {/* Step 2: Date Range Selection */}
          {availableDates.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>2. Select Date Range</h2>
              <div className="flex items-center space-x-4">
                <label htmlFor="start-date" className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Start Date:</label>
                <select
                  id="start-date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className={`rounded px-2 py-1 border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <label htmlFor="end-date" className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>End Date:</label>
                <select
                  id="end-date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className={`rounded px-2 py-1 border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  {availableDates
                    .filter(date => date >= startDate)
                    .map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
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
                      Predicting Weather (API)
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Fetching weather forecast for selected location...
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
                      Weather API Error
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

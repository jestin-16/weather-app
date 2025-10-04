import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { TrendingUp, Calendar, Thermometer, Droplets, Wind } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WeatherTrends = ({ weatherTrends, selectedLocation, darkMode }) => {
  if (!weatherTrends) {
    return (
      <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center py-12">
          <TrendingUp className={`mx-auto mb-4 transition-colors duration-300 ${
            
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} size={48} />
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No Trend Data Available
          </h3>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Select a location and run an analysis to view weather trends and forecasts.
          </p>
        </div>
      </div>
    );
  }

  const { historical, forecast } = weatherTrends;

  // Historical data chart
  const historicalChartData = {
    labels: historical.map(item => item.month),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: historical.map(item => item.temperature),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Precipitation (in)',
        data: historical.map(item => item.precipitation),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Wind Speed (mph)',
        data: historical.map(item => item.windSpeed),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y2',
      }
    ],
  };

  const historicalChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        text: 'Historical Weather Trends (2024)',
        color: darkMode ? '#e5e7eb' : '#374151'
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°F)',
          color: darkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Precipitation (in)',
          color: darkMode ? '#e5e7eb' : '#374151'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280'
        }
      },
      y2: {
        type: 'linear',
        display: false,
      }
    },
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      windy: '💨'
    };
    return icons[condition] || '🌤️';
  };

  const getConditionColor = (condition) => {
    const colors = {
      sunny: 'text-yellow-500',
      cloudy: 'text-gray-500',
      rainy: 'text-blue-500',
      windy: 'text-green-500'
    };
    return colors[condition] || 'text-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Location Header */}
      {selectedLocation && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="text-3xl">📍</div>
            <div>
              <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedLocation.name}
              </h2>
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Weather Trends & Forecast Analysis
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Historical Trends Chart */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="h-96">
          <Line data={historicalChartData} options={historicalChartOptions} />
        </div>
      </div>

      {/* Forecast Cards */}
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          7-Day Weather Forecast
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
              }`}
            >
              <div className="text-center">
                <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {day.day}
                </p>
                <div className="text-3xl mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.round(day.temperature)}°F
                </p>
                <p className={`text-xs capitalize transition-colors duration-300 ${
                  getConditionColor(day.condition)
                }`}>
                  {day.condition}
                </p>
                <div className="mt-2">
                  <div className={`text-xs transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {Math.round(day.probability)}% chance
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className={`transition-colors duration-300 ${
              darkMode ? 'text-red-400' : 'text-red-500'
            }`} size={24} />
            <h4 className={`font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Temperature Trends
            </h4>
          </div>
          <p className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Average temperature shows seasonal patterns with moderate variability.
          </p>
        </div>

        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <Droplets className={`transition-colors duration-300 ${
              darkMode ? 'text-blue-400' : 'text-blue-500'
            }`} size={24} />
            <h4 className={`font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Precipitation Patterns
            </h4>
          </div>
          <p className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Precipitation levels vary throughout the year with peak periods identified.
          </p>
        </div>

        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <Wind className={`transition-colors duration-300 ${
              darkMode ? 'text-green-400' : 'text-green-500'
            }`} size={24} />
            <h4 className={`font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Wind Conditions
            </h4>
          </div>
          <p className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Wind speeds show consistent patterns with occasional high-wind events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherTrends;

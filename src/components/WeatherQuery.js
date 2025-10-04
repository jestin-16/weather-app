import React, { useState } from 'react';
import { Calendar, Thermometer, Wind, Droplets, Eye } from 'lucide-react';

const WeatherQuery = ({ onQuerySubmit, selectedLocation }) => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [timeRange, setTimeRange] = useState({
    startDate: '',
    endDate: '',
    dayOfYear: ''
  });
  const [thresholds, setThresholds] = useState({
    temperature: { hot: 90, cold: 32 },
    windSpeed: 25,
    precipitation: 0.5,
    airQuality: 100
  });

  const weatherConditions = [
    {
      id: 'very-hot',
      name: 'Very Hot',
      icon: Thermometer,
      description: 'Extreme heat conditions',
      unit: '°F',
      threshold: thresholds.temperature.hot
    },
    {
      id: 'very-cold',
      name: 'Very Cold',
      icon: Thermometer,
      description: 'Extreme cold conditions',
      unit: '°F',
      threshold: thresholds.temperature.cold
    },
    {
      id: 'very-windy',
      name: 'Very Windy',
      icon: Wind,
      description: 'High wind speed conditions',
      unit: 'mph',
      threshold: thresholds.windSpeed
    },
    {
      id: 'very-wet',
      name: 'Very Wet',
      icon: Droplets,
      description: 'Heavy precipitation conditions',
      unit: 'in/day',
      threshold: thresholds.precipitation
    },
    {
      id: 'poor-air-quality',
      name: 'Poor Air Quality',
      icon: Eye,
      description: 'Unhealthy air quality conditions',
      unit: 'AQI',
      threshold: thresholds.airQuality
    }
  ];

  const handleConditionToggle = (conditionId) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId) 
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleThresholdChange = (conditionId, value) => {
    setThresholds(prev => {
      const newThresholds = { ...prev };
      if (conditionId === 'very-hot') {
        newThresholds.temperature.hot = parseFloat(value);
      } else if (conditionId === 'very-cold') {
        newThresholds.temperature.cold = parseFloat(value);
      } else if (conditionId === 'very-windy') {
        newThresholds.windSpeed = parseFloat(value);
      } else if (conditionId === 'very-wet') {
        newThresholds.precipitation = parseFloat(value);
      } else if (conditionId === 'poor-air-quality') {
        newThresholds.airQuality = parseFloat(value);
      }
      return newThresholds;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedConditions.length === 0) {
      alert('Please select at least one weather condition to analyze.');
      return;
    }

    const query = {
      location: selectedLocation,
      conditions: selectedConditions,
      timeRange,
      thresholds: selectedConditions.reduce((acc, conditionId) => {
        const condition = weatherConditions.find(c => c.id === conditionId);
        if (condition) {
          acc[conditionId] = {
            threshold: condition.threshold,
            unit: condition.unit
          };
        }
        return acc;
      }, {}),
      timestamp: new Date().toISOString()
    };

    onQuerySubmit(query);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar className="mr-2 text-blue-600" />
        Weather Query Configuration
      </h2>

      {/* Time Range Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Time Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={timeRange.startDate}
              onChange={(e) => setTimeRange({ ...timeRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={timeRange.endDate}
              onChange={(e) => setTimeRange({ ...timeRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of Year (1-365)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={timeRange.dayOfYear}
              onChange={(e) => setTimeRange({ ...timeRange, dayOfYear: e.target.value })}
              placeholder="e.g., 150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Weather Conditions Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Weather Conditions</h3>
        <div className="space-y-4">
          {weatherConditions.map((condition) => {
            const IconComponent = condition.icon;
            const isSelected = selectedConditions.includes(condition.id);
            
            return (
              <div key={condition.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={condition.id}
                      checked={isSelected}
                      onChange={() => handleConditionToggle(condition.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <IconComponent className="mr-2 text-blue-600" size={20} />
                    <label htmlFor={condition.id} className="text-sm font-medium text-gray-700">
                      {condition.name}
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{condition.description}</p>
                
                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">Threshold:</label>
                    <input
                      type="number"
                      step="any"
                      value={condition.threshold}
                      onChange={(e) => handleThresholdChange(condition.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                    />
                    <span className="text-sm text-gray-500">{condition.unit}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedLocation || selectedConditions.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Analyze Weather Conditions
      </button>
    </div>
  );
};

export default WeatherQuery;

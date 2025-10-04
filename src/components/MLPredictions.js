import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import weatherService from '../services/weatherService';

const MLPredictions = ({ selectedLocation, darkMode }) => {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (selectedLocation) {
      loadMLPredictions();
    }
  }, [selectedLocation]);

  const loadMLPredictions = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const mlPrediction = await weatherService.getMLWeatherPrediction(
        selectedLocation.lat, 
        selectedLocation.lon, 
        7
      );
      
      setPredictions(mlPrediction);
      
      // Simulate model information
      setModelInfo({
        name: 'Neural Weather Network v2.1',
        accuracy: 94.2,
        trainingData: '10+ years of global weather data',
        lastUpdated: new Date().toISOString(),
        features: ['Temperature', 'Humidity', 'Pressure', 'Wind', 'Historical Patterns', 'Seasonal Trends']
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle className="text-red-500" size={20} />;
      case 'Medium': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'Low': return <CheckCircle className="text-green-500" size={20} />;
      default: return <CheckCircle className="text-gray-500" size={20} />;
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!selectedLocation) {
    return (
      <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <Brain className={`mx-auto mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`} size={48} />
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Weather Predictions
          </h3>
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Select a location to view AI-powered weather predictions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Information */}
      {modelInfo && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="text-blue-500" size={24} />
            <h3 className={`text-xl font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {modelInfo.name}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {modelInfo.accuracy}%
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Accuracy Rate
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {modelInfo.trainingData}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Training Data
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {modelInfo.features.length}
              </div>
              <div className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Features Analyzed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="ml-6">
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Analyzing Weather Patterns
              </h3>
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Processing neural network predictions...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
          darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
        } border`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                darkMode ? 'text-red-300' : 'text-red-800'
              }`}>
                Prediction Error
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

      {/* Predictions */}
      {predictions && !isLoading && (
        <div className="space-y-6">
          {/* Location Header */}
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="text-blue-500" size={24} />
              <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Predictions for {selectedLocation.name}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {predictions.confidence * 100}%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Model Confidence
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {predictions.predictions.length}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Days Predicted
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {predictions.model}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI Model
                </div>
              </div>
            </div>
          </div>

          {/* Daily Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions.predictions.map((prediction, index) => (
              <div key={index} className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-blue-500" size={20} />
                    <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {prediction.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(prediction.riskLevel)}`}>
                    <div className="flex items-center space-x-1">
                      {getRiskIcon(prediction.riskLevel)}
                      <span>{prediction.riskLevel} Risk</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Weather Conditions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Thermometer className="text-red-500" size={20} />
                      <div>
                        <div className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Temperature
                        </div>
                        <div className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {prediction.temperature}°C
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Droplets className="text-blue-500" size={20} />
                      <div>
                        <div className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Humidity
                        </div>
                        <div className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {prediction.humidity}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Wind className="text-green-500" size={20} />
                      <div>
                        <div className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Pressure
                        </div>
                        <div className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {prediction.pressure} hPa
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Eye className="text-purple-500" size={20} />
                      <div>
                        <div className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Condition
                        </div>
                        <div className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {prediction.condition}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        AI Confidence
                      </span>
                      <span className={`text-sm font-bold ${getConfidenceColor(prediction.confidence)}`}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          prediction.confidence >= 0.8 ? 'bg-green-500' :
                          prediction.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model Features */}
          {modelInfo && (
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Model Features
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {modelInfo.features.map((feature, index) => (
                  <div key={index} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <TrendingUp className="text-blue-500" size={16} />
                    <span className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MLPredictions;

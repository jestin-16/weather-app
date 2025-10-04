import React, { useState } from 'react';
import { FileText, Database, Download } from 'lucide-react';
import nasaWeatherService from '../services/nasaWeatherService';

const DataDownload = ({ queryResults, onDownload, darkMode }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!queryResults) {
    return null;
  }

  // Safely extract data with fallbacks
  const location = queryResults.location || {};
  const conditions = queryResults.conditions || [];
  const probabilities = queryResults.probabilities || [];
  const thresholds = queryResults.thresholds || {};
  const metadata = queryResults.metadata || {};
  const timestamp = queryResults.timestamp || new Date().toISOString();


  const handleCSVDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      // Create query object for backend
      const query = {
        location: {
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          method: location.method || 'search'
        },
        conditions: conditions.map(c => c.value || c),
        time_range: {
          start_date: metadata?.analysis_parameters?.time_range?.start_date || null,
          end_date: metadata?.analysis_parameters?.time_range?.end_date || null,
          day_of_year: metadata?.analysis_parameters?.time_range?.day_of_year || null
        },
        thresholds: {
          temperature_hot: thresholds['very-hot']?.threshold || 90,
          temperature_cold: thresholds['very-cold']?.threshold || 32,
          wind_speed: thresholds['very-windy']?.threshold || 25,
          precipitation: thresholds['very-wet']?.threshold || 0.5,
          air_quality: thresholds['poor-air-quality']?.threshold || 100
        }
      };

      const result = await nasaWeatherService.downloadCSV(query);
      console.log('CSV download successful:', result);
    } catch (error) {
      setDownloadError(error.message);
      console.error('CSV download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleJSONDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      // Create query object for backend
      const query = {
        location: {
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          method: location.method || 'search'
        },
        conditions: conditions.map(c => c.value || c),
        time_range: {
          start_date: metadata?.analysis_parameters?.time_range?.start_date || null,
          end_date: metadata?.analysis_parameters?.time_range?.end_date || null,
          day_of_year: metadata?.analysis_parameters?.time_range?.day_of_year || null
        },
        thresholds: {
          temperature_hot: thresholds['very-hot']?.threshold || 90,
          temperature_cold: thresholds['very-cold']?.threshold || 32,
          wind_speed: thresholds['very-windy']?.threshold || 25,
          precipitation: thresholds['very-wet']?.threshold || 0.5,
          air_quality: thresholds['poor-air-quality']?.threshold || 100
        }
      };

      const result = await nasaWeatherService.downloadJSON(query);
      console.log('JSON download successful:', result);
    } catch (error) {
      setDownloadError(error.message);
      console.error('JSON download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center transition-colors duration-300 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <Download className="mr-2 text-blue-600" />
        Download Analysis Data
      </h2>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Data Export Options</h3>
          <p className={`text-sm mb-4 transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Download your weather analysis results in various formats for further analysis or record keeping.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleCSVDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              <FileText className="mr-2" size={16} />
              {isDownloading ? 'Downloading...' : 'Download CSV'}
            </button>
            
            <button
              onClick={handleJSONDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              <Database className="mr-2" size={16} />
              {isDownloading ? 'Downloading...' : 'Download JSON'}
            </button>
          </div>
          
          {downloadError && (
            <div className={`mt-4 p-3 rounded-md border transition-colors duration-300 ${
              darkMode 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm transition-colors duration-300 ${
                darkMode ? 'text-red-300' : 'text-red-800'
              }`}>
                <strong>Download Error:</strong> {downloadError}
              </p>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            darkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>Data Description</h3>
          <div className={`text-sm space-y-1 transition-colors duration-300 ${
            darkMode ? 'text-blue-200' : 'text-blue-700'
          }`}>
            <p><strong>Location:</strong> {location.name || 'Unknown'} ({location.lat ? location.lat.toFixed(4) : 'N/A'}, {location.lon ? location.lon.toFixed(4) : 'N/A'})</p>
            <p><strong>Analysis Date:</strong> {new Date(timestamp).toLocaleString()}</p>
            <p><strong>Data Source:</strong> NASA Earth Observation Data</p>
            <p><strong>Conditions Analyzed:</strong> {conditions.length}</p>
            <p><strong>High Risk Conditions:</strong> {probabilities.filter(p => p >= 70).length}</p>
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors duration-300 ${
          darkMode 
            ? 'bg-yellow-900/20 border-yellow-800' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
            darkMode ? 'text-yellow-300' : 'text-yellow-800'
          }`}>Data Usage Notes</h3>
          <ul className={`text-sm space-y-1 transition-colors duration-300 ${
            darkMode ? 'text-yellow-200' : 'text-yellow-700'
          }`}>
            <li>• Data is based on historical patterns and statistical analysis</li>
            <li>• Always verify with real-time weather forecasts before making decisions</li>
            <li>• Probabilities represent likelihood of exceeding specified thresholds</li>
            <li>• Data includes metadata for proper attribution and units</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataDownload;

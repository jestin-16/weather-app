import React, { useState } from 'react';
import { FileText, Database, Download } from 'lucide-react';
import nasaWeatherService from '../services/nasaWeatherService';

const DataDownload = ({ queryResults, onDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!queryResults) {
    return null;
  }

  const { location, conditions, probabilities, thresholds, metadata } = queryResults;


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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Download className="mr-2 text-blue-600" />
        Download Analysis Data
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Data Export Options</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download your weather analysis results in various formats for further analysis or record keeping.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={handleCSVDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="mr-2" size={16} />
              {isDownloading ? 'Downloading...' : 'Download CSV'}
            </button>
            
            <button
              onClick={handleJSONDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Database className="mr-2" size={16} />
              {isDownloading ? 'Downloading...' : 'Download JSON'}
            </button>
          </div>
          
          {downloadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Download Error:</strong> {downloadError}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Data Description</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Location:</strong> {location.name} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</p>
            <p><strong>Analysis Date:</strong> {new Date(metadata.timestamp).toLocaleString()}</p>
            <p><strong>Data Source:</strong> NASA Earth Observation Data</p>
            <p><strong>Conditions Analyzed:</strong> {conditions.length}</p>
            <p><strong>High Risk Conditions:</strong> {probabilities.filter(p => p >= 70).length}</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Data Usage Notes</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
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

import axios from 'axios';

// FastAPI Backend configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_ENDPOINTS = {
  analyze: `${API_BASE_URL}/api/v1/analyze`,
  parameters: `${API_BASE_URL}/api/v1/parameters`,
  downloadCSV: `${API_BASE_URL}/api/v1/download/csv`,
  downloadJSON: `${API_BASE_URL}/api/v1/download/json`,
  health: `${API_BASE_URL}/api/v1/health`
};

class NASAWeatherService {
  constructor() {
    this.apiBaseUrl = API_BASE_URL;
  }

  // Analyze weather conditions using FastAPI backend
  async analyzeWeatherConditions(query) {
    try {
      const response = await axios.post(API_ENDPOINTS.analyze, query, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing weather conditions:', error);
      if (error.response) {
        throw new Error(error.response.data.detail || 'Failed to analyze weather conditions.');
      } else if (error.request) {
        throw new Error('Unable to connect to weather service. Please check your connection.');
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  // Download analysis results as CSV
  async downloadCSV(query) {
    try {
      const response = await axios.post(API_ENDPOINTS.downloadCSV, query, {
        responseType: 'blob',
        timeout: 30000
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'weather_analysis.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading CSV:', error);
      throw new Error('Failed to download CSV file. Please try again.');
    }
  }

  // Download analysis results as JSON
  async downloadJSON(query) {
    try {
      const response = await axios.post(API_ENDPOINTS.downloadJSON, query, {
        responseType: 'blob',
        timeout: 30000
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'weather_analysis.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading JSON:', error);
      throw new Error('Failed to download JSON file. Please try again.');
    }
  }

  // Get available parameters from the backend
  async getAvailableParameters() {
    try {
      const response = await axios.get(API_ENDPOINTS.parameters, {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available parameters:', error);
      throw new Error('Failed to fetch available parameters.');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(API_ENDPOINTS.health, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Generate realistic probabilities based on location and conditions
  generateProbabilities(location, conditions, thresholds) {
    const probabilities = [];
    
    // Base probabilities influenced by location (latitude affects temperature extremes)
    const latFactor = Math.abs(location.lat) / 90; // 0 to 1
    
    conditions.forEach(condition => {
      let baseProbability = 0;
      
      switch (condition) {
        case 'very-hot':
          // Higher probability in lower latitudes and summer months
          baseProbability = (1 - latFactor) * 0.4 + Math.random() * 0.3;
          break;
        case 'very-cold':
          // Higher probability in higher latitudes and winter months
          baseProbability = latFactor * 0.4 + Math.random() * 0.3;
          break;
        case 'very-windy':
          // Coastal areas and mountainous regions tend to be windier
          baseProbability = 0.2 + Math.random() * 0.4;
          break;
        case 'very-wet':
          // Tropical and coastal areas have higher precipitation
          baseProbability = (1 - latFactor) * 0.3 + Math.random() * 0.3;
          break;
        case 'poor-air-quality':
          // Urban areas and certain geographic regions
          baseProbability = 0.1 + Math.random() * 0.3;
          break;
        default:
          baseProbability = Math.random() * 0.5;
      }
      
      // Add some randomness and ensure reasonable ranges
      const probability = Math.min(95, Math.max(5, Math.round(baseProbability * 100)));
      probabilities.push(probability);
    });
    
    return probabilities;
  }


  // Get historical data for a specific location and parameter
  async getHistoricalData(location, parameter, startDate, endDate) {
    try {
      const params = {
        request: 'execute',
        identifier: parameter,
        parameters: parameter,
        startDate: startDate,
        endDate: endDate,
        userCommunity: 'SSE',
        tempAverage: 'DAILY',
        outputList: 'JSON',
        lat: location.lat,
        lon: location.lon,
        user: this.apiKey
      };

      const response = await this.client.get(this.base_url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw new Error('Failed to fetch historical weather data');
    }
  }

  // Calculate statistics for a given dataset
  calculateStatistics(data, threshold) {
    if (!data || data.length === 0) {
      return {
        mean: 0,
        median: 0,
        standardDeviation: 0,
        probabilityAboveThreshold: 0,
        probabilityBelowThreshold: 0
      };
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const median = sortedData[Math.floor(sortedData.length / 2)];
    
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const standardDeviation = Math.sqrt(variance);
    
    const aboveThreshold = data.filter(value => value > threshold).length;
    const probabilityAboveThreshold = (aboveThreshold / data.length) * 100;
    const probabilityBelowThreshold = 100 - probabilityAboveThreshold;

    return {
      mean,
      median,
      standardDeviation,
      probabilityAboveThreshold,
      probabilityBelowThreshold,
      min: Math.min(...data),
      max: Math.max(...data),
      count: data.length
    };
  }
}

const nasaWeatherService = new NASAWeatherService();
export default nasaWeatherService;

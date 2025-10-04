// Geocoding service using OpenStreetMap Nominatim API
class GeocodingService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org/search';
    this.rateLimitDelay = 1000; // 1 second delay between requests
    this.lastRequestTime = 0;
  }

  // Add rate limiting to respect Nominatim's usage policy
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  // Search for a location and return coordinates
  async searchLocation(query) {
    try {
      await this.rateLimit();
      
      const response = await fetch(
        `${this.baseUrl}?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&extratags=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return data.map(result => ({
          name: result.display_name,
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          type: result.type,
          importance: result.importance,
          address: result.address
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to search for location. Please try again.');
    }
  }

  // Get coordinates for a specific location
  async getCoordinates(query) {
    try {
      const results = await this.searchLocation(query);
      if (results.length > 0) {
        // Return the most important result
        const bestResult = results.reduce((prev, current) => 
          (prev.importance > current.importance) ? prev : current
        );
        return [bestResult.lat, bestResult.lon];
      }
      return null;
    } catch (error) {
      console.error('Coordinate lookup error:', error);
      return null;
    }
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(lat, lon) {
    try {
      await this.rateLimit();
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return {
          name: data.display_name,
          address: data.address,
          lat: parseFloat(data.lat),
          lon: parseFloat(data.lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const geocodingService = new GeocodingService();
export default geocodingService;

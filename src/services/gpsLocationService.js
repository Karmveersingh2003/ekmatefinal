import axiosInstance from '../utils/axiosConfig';

/**
 * GPS Location service for handling location tracking API calls
 */
const gpsLocationService = {
  /**
   * Create location entry
   * @param {Object} locationData - Location data
   * @returns {Promise} Promise with created location data
   */
  createLocation: async (locationData) => {
    try {
      const response = await axiosInstance.post('/gps-locations', locationData);
      return response.data;
    } catch (error) {
      console.error('Error in createLocation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create location entry',
        data: null
      };
    }
  },

  /**
   * Get latest location for a bus
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with latest location data
   */
  getLatestLocation: async (busId) => {
    try {
      const response = await axiosInstance.get(`/gps-locations/buses/${busId}/latest`);
      return response.data;
    } catch (error) {
      console.error('Error in getLatestLocation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch latest location',
        data: null
      };
    }
  },

  /**
   * Get location history for a bus
   * @param {string} busId - Bus ID
   * @param {Object} params - Optional parameters like startDate, endDate
   * @returns {Promise} Promise with location history
   */
  getLocationHistory: async (busId, params = {}) => {
    try {
      let url = `/gps-locations/buses/${busId}/history`;

      // Add query parameters if provided
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error in getLocationHistory:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch location history',
        data: []
      };
    }
  },

  /**
   * Update location
   * @param {string} id - Location ID
   * @param {Object} locationData - Updated location data
   * @returns {Promise} Promise with updated location data
   */
  updateLocation: async (id, locationData) => {
    try {
      const response = await axiosInstance.put(`/gps-locations/${id}`, locationData);
      return response.data;
    } catch (error) {
      console.error('Error in updateLocation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update location',
        data: null
      };
    }
  },

  /**
   * Get all active locations
   * @returns {Promise} Promise with active locations data
   */
  getAllActiveLocations: async () => {
    try {
      const response = await axiosInstance.get('/gps-locations/active');
      return response.data;
    } catch (error) {
      console.error('Error in getAllActiveLocations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active locations',
        data: []
      };
    }
  },

  /**
   * Calculate ETA for a bus
   * @param {string} busId - Bus ID
   * @param {Object} params - Optional parameters like destinationLat, destinationLng
   * @returns {Promise} Promise with ETA data
   */
  calculateETA: async (busId, params = {}) => {
    try {
      let url = `/gps-locations/buses/${busId}/eta`;

      // Add query parameters if provided
      const queryParams = new URLSearchParams();
      if (params.destinationLat) queryParams.append('destinationLat', params.destinationLat);
      if (params.destinationLng) queryParams.append('destinationLng', params.destinationLng);
      if (params.stopId) queryParams.append('stopId', params.stopId);

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error in calculateETA:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to calculate ETA',
        data: null
      };
    }
  }
};

export default gpsLocationService;

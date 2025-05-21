import axiosInstance from '../utils/axiosConfig';

/**
 * Bus service for handling bus-related API calls
 */
const busService = {
  /**
   * Get all buses
   * @param {Object} params - Search parameters
   * @param {string} params.route - Route to search for
   * @param {string} params.busNumber - Bus number to search for
   * @returns {Promise} Promise with buses data
   */
  getAllBuses: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/buses', { params });
      // console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getAllBuses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch buses',
        data: []
      };
    }
  },

  /**
   * Get bus by ID
   * @param {string} id - Bus ID
   * @returns {Promise} Promise with bus data
   */
  getBusById: async (id) => {
    try {
      const response = await axiosInstance.get(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getBusById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bus details',
        data: null
      };
    }
  },

  /**
   * Create a new bus
   * @param {Object} busData - Bus data
   * @returns {Promise} Promise with created bus data
   */
  createBus: async (busData) => {
    try {
      const response = await axiosInstance.post('/buses', busData);
      return response.data;
    } catch (error) {
      console.error('Error in createBus:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create bus',
        data: null
      };
    }
  },

  /**
   * Update a bus
   * @param {string} id - Bus ID
   * @param {Object} busData - Updated bus data
   * @returns {Promise} Promise with updated bus data
   */
  updateBus: async (id, busData) => {
    try {
      const response = await axiosInstance.put(`/buses/${id}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error in updateBus:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update bus',
        data: null
      };
    }
  },

  /**
   * Delete a bus
   * @param {string} id - Bus ID
   * @returns {Promise} Promise with deletion status
   */
  deleteBus: async (id) => {
    try {
      const response = await axiosInstance.delete(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteBus:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete bus',
        data: null
      };
    }
  },

  /**
   * Get latest location of a bus
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with location data
   */
  getLatestLocation: async (busId) => {
    try {
      const response = await axiosInstance.get(`/gps-locations/buses/${busId}/latest`);
      return response.data;
    } catch (error) {
      console.error('Error in getLatestLocation:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bus location',
        data: null
      };
    }
  },

  /**
   * Get all active bus locations
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
   * @returns {Promise} Promise with ETA data
   */
  calculateETA: async (busId) => {
    try {
      const response = await axiosInstance.get(`/gps-locations/buses/${busId}/eta`);
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

export default busService;

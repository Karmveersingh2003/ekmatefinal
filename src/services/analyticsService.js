import axiosInstance from '../utils/axiosConfig';

/**
 * Analytics service for handling bus analytics API calls
 */
const analyticsService = {
  /**
   * Create analytics entry (admin only)
   * @param {Object} analyticsData - Analytics data
   * @returns {Promise} Promise with created analytics data
   */
  createAnalytics: async (analyticsData) => {
    try {
      const response = await axiosInstance.post('/analytics', analyticsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create analytics entry' };
    }
  },

  /**
   * Get analytics by ID (admin only)
   * @param {string} id - Analytics ID
   * @returns {Promise} Promise with analytics data
   */
  getAnalyticsById: async (id) => {
    try {
      const response = await axiosInstance.get(`/analytics/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics details' };
    }
  },

  /**
   * Get analytics by bus ID and date (admin only)
   * @param {string} busId - Bus ID
   * @param {string} date - Date in ISO format (optional)
   * @returns {Promise} Promise with analytics data
   */
  getAnalyticsByBusIdAndDate: async (busId, date) => {
    try {
      const url = date
        ? `/analytics/buses/${busId}?date=${date}`
        : `/analytics/buses/${busId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bus analytics' };
    }
  },

  /**
   * Get analytics for date range (admin only)
   * @param {string} busId - Bus ID
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} Promise with analytics data
   */
  getAnalyticsForDateRange: async (busId, startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `/analytics/buses/${busId}/date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics for date range' };
    }
  },

  /**
   * Get peak hour data (admin only)
   * @returns {Promise} Promise with peak hour data
   */
  getPeakHourData: async () => {
    try {
      const response = await axiosInstance.get('/analytics/peak-hours');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch peak hour data' };
    }
  },

  /**
   * Update analytics (admin only)
   * @param {string} id - Analytics ID
   * @param {Object} analyticsData - Updated analytics data
   * @returns {Promise} Promise with updated analytics data
   */
  updateAnalytics: async (id, analyticsData) => {
    try {
      const response = await axiosInstance.put(`/analytics/${id}`, analyticsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update analytics' };
    }
  },

  /**
   * Update or create analytics for a bus (admin only)
   * @param {string} busId - Bus ID
   * @param {Object} analyticsData - Analytics data
   * @returns {Promise} Promise with updated or created analytics data
   */
  updateOrCreateAnalytics: async (busId, analyticsData) => {
    try {
      const response = await axiosInstance.put(`/analytics/buses/${busId}`, analyticsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update or create analytics' };
    }
  },

  /**
   * Record passenger count
   * @param {string} busId - Bus ID
   * @param {Object} countData - Passenger count data
   * @returns {Promise} Promise with updated analytics
   */
  recordPassengerCount: async (busId, countData) => {
    try {
      const response = await axiosInstance.post(`/analytics/buses/${busId}/passenger-count`, countData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to record passenger count' };
    }
  },

  /**
   * Get analytics for a specific bus and date range
   * @param {string} busId - Bus ID
   * @param {string} startDate - Start date in ISO format
   * @param {string} endDate - End date in ISO format
   * @returns {Promise} Promise with analytics data
   */
  getAnalyticsByBusIdAndDateRange: async (busId, startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `/analytics/buses/${busId}/date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error in getAnalyticsByBusIdAndDateRange:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics for date range',
        data: []
      };
    }
  },

  /**
   * Get bus utilization data
   * @returns {Promise} Promise with bus utilization data
   */
  getBusUtilization: async () => {
    try {
      // Use the dedicated endpoint for bus utilization
      const response = await axiosInstance.get('/analytics/bus-utilization');
      return response.data;
    } catch (error) {
      console.error('Error in getBusUtilization:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bus utilization data',
        data: []
      };
    }
  },

  /**
   * Get route distribution data
   * @returns {Promise} Promise with route distribution data
   */
  getRouteDistribution: async () => {
    try {
      // Use the dedicated endpoint for route distribution
      const response = await axiosInstance.get('/analytics/route-distribution');
      return response.data;
    } catch (error) {
      console.error('Error in getRouteDistribution:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch route distribution data',
        data: []
      };
    }
  },

  /**
   * Get analytics statistics
   * @returns {Promise} Promise with analytics statistics
   */
  getAnalyticsStats: async () => {
    try {
      // Use the dedicated endpoint for analytics stats
      const response = await axiosInstance.get('/analytics/stats');
      return response.data;
    } catch (error) {
      console.error('Error in getAnalyticsStats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics statistics',
        data: {
          totalPassengers: 0,
          averagePassengersPerDay: 0
        }
      };
    }
  }
};

export default analyticsService;

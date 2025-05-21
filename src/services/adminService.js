import axiosInstance from '../utils/axiosConfig';

/**
 * Admin service for handling admin-related API calls
 */
const adminService = {
  /**
   * Get admin dashboard statistics
   * @returns {Promise} Promise with dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics',
        data: null
      };
    }
  },

  /**
   * Get recent activities for admin dashboard
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} Promise with recent activities
   */
  getRecentActivities: async (limit = 5) => {
    try {
      const response = await axiosInstance.get('/admin/activities/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error in getRecentActivities:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent activities',
        data: []
      };
    }
  },

  /**
   * Get upcoming events for admin dashboard
   * @param {number} limit - Number of events to fetch
   * @returns {Promise} Promise with upcoming events
   */
  getUpcomingEvents: async (limit = 5) => {
    try {
      const response = await axiosInstance.get('/admin/events/upcoming', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error in getUpcomingEvents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch upcoming events',
        data: []
      };
    }
  },

  /**
   * Get analytics data for admin dashboard
   * @param {string} period - Time period for analytics (daily, weekly, monthly)
   * @returns {Promise} Promise with analytics data
   */
  getAnalyticsData: async (period = 'monthly') => {
    try {
      const response = await axiosInstance.get('/admin/analytics', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error in getAnalyticsData:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics data',
        data: null
      };
    }
  }
};

export default adminService;

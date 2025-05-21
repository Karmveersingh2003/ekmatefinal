import axiosInstance from '../utils/axiosConfig';

/**
 * User Preferences service for handling user preferences API calls
 */
const userPreferencesService = {
  /**
   * Create or update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferencesData - User preferences data
   * @returns {Promise} Promise with preferences data
   */
  createOrUpdatePreferences: async (userId, preferencesData) => {
    try {
      const response = await axiosInstance.post(`/users/${userId}/preferences`, preferencesData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update preferences' };
    }
  },

  /**
   * Get user preferences
   * @param {string} userId - User ID
   * @returns {Promise} Promise with preferences data
   */
  getUserPreferences: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/preferences`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch preferences' };
    }
  },

  /**
   * Add favorite route
   * @param {string} userId - User ID
   * @param {Object} routeData - Route data to add to favorites
   * @returns {Promise} Promise with updated favorites
   */
  addFavoriteRoute: async (userId, routeData) => {
    try {
      const response = await axiosInstance.post(`/users/${userId}/favorite-routes`, routeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add favorite route' };
    }
  },

  /**
   * Remove favorite route
   * @param {string} userId - User ID
   * @param {Object} routeData - Route data to remove from favorites
   * @returns {Promise} Promise with updated favorites
   */
  removeFavoriteRoute: async (userId, routeData) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}/favorite-routes`, { data: routeData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove favorite route' };
    }
  },

  /**
   * Update notification settings
   * @param {string} userId - User ID
   * @param {Object} notificationSettings - Updated notification settings
   * @returns {Promise} Promise with updated settings
   */
  updateNotificationSettings: async (userId, notificationSettings) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/notification-settings`, notificationSettings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update notification settings' };
    }
  },

  /**
   * Update class schedule
   * @param {string} userId - User ID
   * @param {Object} scheduleData - Updated class schedule
   * @returns {Promise} Promise with updated schedule
   */
  updateClassSchedule: async (userId, scheduleData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/class-schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update class schedule' };
    }
  },

  /**
   * Get favorite routes
   * @param {string} userId - User ID
   * @returns {Promise} Promise with favorite routes
   */
  getFavoriteRoutes: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/favorite-routes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch favorite routes' };
    }
  }
};

export default userPreferencesService;

import axiosInstance from '../utils/axiosConfig';

/**
 * User service for handling user-related API calls
 */
const userService = {
  /**
   * Get all users (admin only)
   * @param {Object} params - Search parameters
   * @returns {Promise} Promise with users data
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        data: []
      };
    }
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} Promise with user data
   */
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user details',
        data: null
      };
    }
  },

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} Promise with created user data
   */
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error in createUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
        data: null
      };
    }
  },

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise with updated user data
   */
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
        data: null
      };
    }
  },

  /**
   * Delete a user (admin only)
   * @param {string} id - User ID
   * @returns {Promise} Promise with deletion status
   */
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        data: null
      };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Promise with user profile data
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile',
        data: null
      };
    }
  },

  /**
   * Update current user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Promise with updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        data: null
      };
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Contains old and new password
   * @returns {Promise} Promise with password change status
   */
  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error in changePassword:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
        data: null
      };
    }
  }
};

export default userService;

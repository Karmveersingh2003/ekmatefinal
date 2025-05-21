import axiosInstance from '../utils/axiosConfig';

/**
 * Profile service for handling user profile-related API calls
 */
const profileService = {
  /**
   * Get current user profile
   * @returns {Promise} Promise with user profile data
   */
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile',
        data: null
      };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Promise with updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/me', profileData);
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
   * @param {Object} passwordData - Password data containing currentPassword and newPassword
   * @returns {Promise} Promise with result
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
  },

  /**
   * Upload profile picture
   * @param {FormData} formData - Form data containing the profile picture
   * @returns {Promise} Promise with result
   */
  uploadProfilePicture: async (formData) => {
    try {
      const response = await axiosInstance.post('/users/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload profile picture',
        data: null
      };
    }
  }
};

export default profileService;

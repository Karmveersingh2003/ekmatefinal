import axiosInstance from '../utils/axiosConfig';

/**
 * Feedback service for handling feedback-related API calls
 */
const feedbackService = {
  /**
   * Create new feedback
   * @param {Object} feedbackData - Feedback data
   * @returns {Promise} Promise with created feedback data
   */
  createFeedback: async (feedbackData) => {
    try {
      const response = await axiosInstance.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit feedback' };
    }
  },

  /**
   * Get feedback by ID
   * @param {string} id - Feedback ID
   * @returns {Promise} Promise with feedback data
   */
  getFeedbackById: async (id) => {
    try {
      const response = await axiosInstance.get(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch feedback details' };
    }
  },

  /**
   * Get feedback by bus ID
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with feedback data
   */
  getFeedbackByBusId: async (busId) => {
    try {
      const response = await axiosInstance.get(`/feedback/buses/${busId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bus feedback' };
    }
  },

  /**
   * Get feedback by user ID
   * @param {string} userId - User ID
   * @returns {Promise} Promise with feedback data
   */
  getFeedbackByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/feedback/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user feedback' };
    }
  },

  /**
   * Update feedback
   * @param {string} id - Feedback ID
   * @param {Object} feedbackData - Updated feedback data
   * @returns {Promise} Promise with updated feedback data
   */
  updateFeedback: async (id, feedbackData) => {
    try {
      const response = await axiosInstance.put(`/feedback/${id}`, feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update feedback' };
    }
  },

  /**
   * Respond to feedback (admin only)
   * @param {string} id - Feedback ID
   * @param {Object} responseData - Response data
   * @returns {Promise} Promise with response result
   */
  respondToFeedback: async (id, responseData) => {
    try {
      const response = await axiosInstance.put(`/feedback/${id}/respond`, responseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to respond to feedback' };
    }
  },

  /**
   * Get average rating for a bus
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with rating data
   */
  getAverageRating: async (busId) => {
    try {
      const response = await axiosInstance.get(`/feedback/buses/${busId}/rating`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch average rating' };
    }
  },

  /**
   * Get feedback statistics for a bus
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with statistics data
   */
  getFeedbackStats: async (busId) => {
    try {
      const response = await axiosInstance.get(`/feedback/buses/${busId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch feedback statistics' };
    }
  },

  /**
   * Get pending feedback (admin only)
   * @returns {Promise} Promise with pending feedback data
   */
  getPendingFeedback: async () => {
    try {
      const response = await axiosInstance.get('/feedback/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending feedback' };
    }
  },

  /**
   * Get all feedback (admin only)
   * @returns {Promise} Promise with all feedback data
   */
  getAllFeedback: async () => {
    try {
      const response = await axiosInstance.get('/feedback');
      return response.data;
    } catch (error) {
      console.error('Error in getAllFeedback:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch feedback',
        data: []
      };
    }
  },

  /**
   * Delete feedback (admin only)
   * @param {string} id - Feedback ID
   * @returns {Promise} Promise with deletion result
   */
  deleteFeedback: async (id) => {
    try {
      const response = await axiosInstance.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteFeedback:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete feedback',
        data: null
      };
    }
  }
};

export default feedbackService;

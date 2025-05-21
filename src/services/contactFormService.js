import axiosInstance from '../utils/axiosConfig';

/**
 * Contact Form service for handling contact form API calls
 */
const contactFormService = {
  /**
   * Create a new contact form query
   * @param {Object} queryData - Contact form query data
   * @returns {Promise} Promise with query submission result
   */
  createQuery: async (queryData) => {
    try {
      const response = await axiosInstance.post('/contact-form-query', queryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit contact form query' };
    }
  }
};

export default contactFormService;

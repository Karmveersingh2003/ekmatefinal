import axiosInstance from '../utils/axiosConfig';

/**
 * Driver service for handling driver-related API calls
 */
const driverService = {
  /**
   * Create a new driver (admin only)
   * @param {Object} driverData - Driver data to be created by admin
   * @returns {Promise} Promise with created driver data
   */
  createDriver: async (driverData) => {
    try {
      const response = await axiosInstance.post('/drivers', driverData);
      return response.data;
    } catch (error) {
      console.error('Error in createDriver:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create driver',
        data: null
      };
    }
  },

  /**
   * Send OTP to driver
   * @param {Object} data - Contains driver's phone or email
   * @returns {Promise} Promise with OTP sending result
   */
  sendOTP: async (data) => {
    try {
      const response = await axiosInstance.post('/driver/auth/send-otp', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  /**
   * Verify driver OTP
   * @param {Object} data - Contains OTP and driver's phone or email
   * @returns {Promise} Promise with verification result
   */
  verifyOTP: async (data) => {
    try {
      const response = await axiosInstance.post('/driver/auth/verify-otp', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  /**
   * Driver login
   * @param {Object} credentials - Driver login credentials
   * @returns {Promise} Promise with login result
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/driver/auth/sign-in', credentials);

      if (response.data.success) {
        const token = response.data.data;

        // Store token in localStorage
        localStorage.setItem('driverToken', token);

        // Decode token to get driver info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const driver = JSON.parse(jsonPayload);
        localStorage.setItem('driver', JSON.stringify(driver));

        return { success: true, driver };
      } else {
        throw response.data;
      }
    } catch (error) {
      throw error.response?.data || { message: 'Driver login failed' };
    }
  },

  /**
   * Get driver by ID
   * @param {string} id - Driver ID
   * @returns {Promise} Promise with driver data
   */
  getDriverById: async (id) => {
    try {
      const response = await axiosInstance.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getDriverById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch driver details',
        data: null
      };
    }
  },

  /**
   * Get all drivers (admin only)
   * @returns {Promise} Promise with all drivers data
   */
  getAllDrivers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/drivers', { params });
      return response.data;
    } catch (error) {
      console.error('Error in getAllDrivers:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch all drivers',
        data: []
      };
    }
  },

  /**
   * Get active drivers (admin only)
   * @returns {Promise} Promise with active drivers data
   */
  getActiveDrivers: async () => {
    try {
      const response = await axiosInstance.get('/drivers/active');
      return response.data;
    } catch (error) {
      console.error('Error in getActiveDrivers:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active drivers',
        data: []
      };
    }
  },

  /**
   * Get drivers with expiring licenses (admin only)
   * @returns {Promise} Promise with drivers data
   */
  getDriversWithExpiringLicenses: async (days = 30) => {
    try {
      const response = await axiosInstance.get('/drivers/expiring-licenses', { params: { days } });
      return response.data;
    } catch (error) {
      console.error('Error in getDriversWithExpiringLicenses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch drivers with expiring licenses',
        data: []
      };
    }
  },

  /**
   * Update driver information (admin only)
   * @param {string} id - Driver ID
   * @param {Object} driverData - Updated driver data
   * @returns {Promise} Promise with updated driver data
   */
  updateDriver: async (id, driverData) => {
    try {
      const response = await axiosInstance.put(`/drivers/${id}`, driverData);
      return response.data;
    } catch (error) {
      console.error('Error in updateDriver:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update driver',
        data: null
      };
    }
  },

  /**
   * Assign bus to driver (admin only)
   * @param {string} id - Driver ID
   * @param {Object} data - Contains busId
   * @returns {Promise} Promise with assignment result
   */
  assignBus: async (id, data) => {
    try {
      const response = await axiosInstance.post(`/drivers/${id}/assign-bus`, data);
      return response.data;
    } catch (error) {
      console.error('Error in assignBus:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign bus to driver',
        data: null
      };
    }
  },

  /**
   * Delete a driver (admin only)
   * @param {string} id - Driver ID
   * @returns {Promise} Promise with deletion status
   */
  deleteDriver: async (id) => {
    try {
      const response = await axiosInstance.delete(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteDriver:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete driver',
        data: null
      };
    }
  }
};

export default driverService;

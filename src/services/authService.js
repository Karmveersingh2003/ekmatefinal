import axiosInstance from '../utils/axiosConfig';

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with registration result
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/sign-up', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Verify OTP for email verification
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise} Promise with verification result
   */
  verifyOTP: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with login result
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/sign-in', { email, password });

      if (response.data.success) {
        // Check if admin OTP verification is required
        if (response.data.requiresOTP) {
          // Validate that we have the required data
          if (!response.data.data || !response.data.data.email) {
            console.error('Missing required data in admin OTP response:', response.data);
            throw new Error('Authentication error: Missing required data for OTP verification');
          }

          return {
            success: true,
            requiresOTP: true,
            email: response.data.data.email,
            role: response.data.data.role
          };
        }

        const token = response.data.data;

        // Validate token
        if (!token) {
          console.error('Missing token in login response:', response.data);
          throw new Error('Authentication error: Missing token in response');
        }

        // Store token in localStorage
        localStorage.setItem('token', token);

        try {
          // Decode token to get user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const user = JSON.parse(jsonPayload);
          return { success: true, user };
        } catch (decodeError) {
          console.error('Error decoding JWT token:', decodeError);
          throw new Error('Error processing authentication token');
        }
      } else {
        throw response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed');
      }
    }
  },

  /**
   * Verify admin OTP and complete login
   * @param {string} email - Admin email
   * @param {string} otp - OTP code
   * @returns {Promise} Promise with verification result
   */
  verifyAdminOTP: async (email, otp) => {
    try {
      if (!email) {
        console.error('Admin email is missing for OTP verification');
        return {
          success: false,
          error: 'Admin email is required for OTP verification'
        };
      }

      if (!otp || otp.length !== 6) {
        console.error('Invalid OTP format:', otp);
        return {
          success: false,
          error: 'Valid 6-digit OTP is required'
        };
      }

      console.log('Verifying admin OTP:', { email, otp });
      // Make sure we're using the correct endpoint
      console.log('API URL:', axiosInstance.defaults.baseURL);
      console.log('Calling endpoint:', '/auth/verify-admin-otp');

      // Add more detailed logging for debugging
      try {
        const response = await axiosInstance.post('/auth/verify-admin-otp', { email, otp });
        console.log('OTP verification response:', response.data);

        if (response.data.success) {
          const token = response.data.data;

          if (!token) {
            console.error('Authentication token missing in response');
            return {
              success: false,
              error: 'Authentication token missing in response'
            };
          }

          // Store token in localStorage
          localStorage.setItem('token', token);

          // Set default authorization header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Decode token to get user info
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const user = JSON.parse(jsonPayload);
            return { success: true, user };
          } catch (decodeError) {
            console.error('Error decoding JWT token:', decodeError);
            return {
              success: false,
              error: 'Error processing authentication token'
            };
          }
        } else {
          console.error('OTP verification failed:', response.data);
          return {
            success: false,
            error: response.data.message || 'OTP verification failed',
            details: response.data
          };
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        console.error('API Error Response:', apiError.response);

        // Try the alternative endpoint as a fallback
        try {
          console.log('Trying fallback endpoint: /auth/verify-otp');
          const fallbackResponse = await axiosInstance.post('/auth/verify-otp', { email, otp });
          console.log('Fallback response:', fallbackResponse.data);

          if (fallbackResponse.data.success) {
            // For regular OTP verification, we don't get a token directly
            // We need to do a regular login after OTP verification
            return {
              success: true,
              message: 'OTP verified successfully. Please login now.',
              verified: true
            };
          } else {
            return {
              success: false,
              error: fallbackResponse.data.message || 'OTP verification failed',
              details: fallbackResponse.data
            };
          }
        } catch (fallbackError) {
          console.error('Fallback API Error:', fallbackError);
          return {
            success: false,
            error: 'All verification attempts failed. Please try again later.',
            details: { apiError, fallbackError }
          };
        }
      }
    } catch (error) {
      // This catch block handles errors that occur outside the API calls
      console.error('Unexpected error in verifyAdminOTP function:', error);

      // Handle different types of errors
      let errorMessage = 'Admin OTP verification failed';

      if (error.response?.data?.err?.message) {
        errorMessage = error.response.data.err.message;
        console.log('Using error message from err.message:', errorMessage);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log('Using error message from message:', errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        console.log('Using error message from error object:', errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || error
      };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Get current user from token in localStorage
   * @returns {Object|null} Current user or null
   */
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decode the JWT token to get user information
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;

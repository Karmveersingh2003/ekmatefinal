import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the JWT token to get user information
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const user = JSON.parse(jsonPayload);

        // Fetch additional user details if needed
        const fetchUserDetails = async () => {
          try {
            const response = await axiosInstance.get('/users/me');
            if (response.data.success) {
              // Combine token data with user details
              setCurrentUser({
                ...user,
                ...response.data.data,
                role: response.data.data.role || 'student' // Default to student if role is not provided
              });
            } else {
              setCurrentUser(user);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
            setCurrentUser(user);
          }
        };

        fetchUserDetails();

        // We don't need to set default headers here as our axiosInstance
        // will handle this in its request interceptor
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, remove it
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);

      console.log('Attempting login with:', { email });
      const response = await axiosInstance.post('/auth/sign-in', { email, password });
      console.log('Login response:', response.data);

      if (response.data.success) {
        console.log('Full login response data:', response.data);

        // Check if response data has the expected structure
        const responseData = response.data.data;

        // Handle both old and new response formats
        let token, userData;

        if (typeof responseData === 'string') {
          // Old format: token is directly in data field
          token = responseData;
          console.log('Using old response format (token only)');
        } else if (responseData && responseData.token) {
          // New format: data contains token and user objects
          token = responseData.token;
          userData = responseData.user;
          console.log('Using new response format with user data:', userData);
        } else {
          const errorMsg = 'Authentication error: Invalid response format';
          console.error(errorMsg, response.data);
          setError(errorMsg);
          return {
            success: false,
            error: errorMsg
          };
        }

        if (!token) {
          const errorMsg = 'Authentication error: Missing token in response';
          console.error(errorMsg, response.data);
          setError(errorMsg);
          return {
            success: false,
            error: errorMsg
          };
        }

        try {
          // Decode the JWT token to get user information
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          // Decode JWT token
          const decodedUser = JSON.parse(jsonPayload);
          console.log('Decoded JWT user data:', decodedUser);

          // Use userData from response if available, otherwise use decoded JWT
          const initialUser = userData || decodedUser;
          console.log('Initial user data:', initialUser);

          // Store only the token in localStorage
          localStorage.setItem('token', token);

          // Set default authorization header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch additional user details
          try {
            const userResponse = await axiosInstance.get('/users/me');
            console.log('User details API response:', userResponse.data);

            if (userResponse.data.success) {
              // Extract role from API response or initial user data
              const role = userResponse.data.data.role || initialUser.role || 'student';
              console.log('User role determined:', role);

              // Combine initial data with user details from API
              const updatedUser = {
                ...initialUser,
                ...userResponse.data.data,
                role: role
              };

              console.log('Setting current user with role:', updatedUser.role);
              setCurrentUser(updatedUser);

              return { success: true, user: updatedUser };
            } else {
              console.log('Using initial user data with role:', initialUser.role || 'unknown');
              setCurrentUser(initialUser);
              return { success: true, user: initialUser };
            }
          } catch (userError) {
            console.error('Error fetching user details:', userError);
            console.log('Falling back to initial user data with role:', initialUser.role || 'unknown');
            setCurrentUser(initialUser);
            return { success: true, user: initialUser };
          }
        } catch (decodeError) {
          const errorMsg = 'Error processing authentication token';
          console.error(errorMsg, decodeError);
          setError(errorMsg);
          return {
            success: false,
            error: errorMsg
          };
        }
      } else {
        // Handle error response from server
        const errorMsg = response.data.message || 'Login failed';
        console.error('Login failed:', errorMsg, response.data.err);
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          details: response.data.err
        };
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);

      let errorMessage = 'Login failed';

      // Check for specific error messages from the backend
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

      // Set the error in the context
      setError(errorMessage);

      // Return detailed error information
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data || error
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Only need to remove the token
    localStorage.removeItem('token');
    // No need to delete headers as axiosInstance handles this
    setCurrentUser(null);
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

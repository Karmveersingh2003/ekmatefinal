import axiosInstance from '../utils/axiosConfig';

/**
 * Event service for handling event-related API calls
 */
const eventService = {
  /**
   * Get all events (admin only)
   * @param {Object} params - Search parameters
   * @returns {Promise} Promise with events data
   */
  getAllEvents: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch events',
        data: []
      };
    }
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise} Promise with created event data
   */
  createEvent: async (eventData) => {
    try {
      const response = await axiosInstance.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error in createEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create event',
        data: null
      };
    }
  },

  /**
   * Get event by ID
   * @param {string} id - Event ID
   * @returns {Promise} Promise with event data
   */
  getEventById: async (id) => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getEventById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch event details',
        data: null
      };
    }
  },

  /**
   * Get events by organizer
   * @param {string} organizerId - Organizer ID
   * @returns {Promise} Promise with events data
   */
  getEventsByOrganizer: async (organizerId) => {
    try {
      const response = await axiosInstance.get(`/events/organizers/${organizerId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getEventsByOrganizer:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch organizer events',
        data: []
      };
    }
  },

  /**
   * Get upcoming events
   * @returns {Promise} Promise with upcoming events data
   */
  getUpcomingEvents: async () => {
    try {
      const response = await axiosInstance.get('/events/upcoming');
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
   * Get pending events (admin only)
   * @returns {Promise} Promise with pending events data
   */
  getPendingEvents: async () => {
    try {
      const response = await axiosInstance.get('/events/pending');
      return response.data;
    } catch (error) {
      console.error('Error in getPendingEvents:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending events',
        data: []
      };
    }
  },

  /**
   * Update an event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} Promise with updated event data
   */
  updateEvent: async (id, eventData) => {
    try {
      const response = await axiosInstance.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error in updateEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update event',
        data: null
      };
    }
  },

  /**
   * Assign bus to event
   * @param {string} id - Event ID
   * @param {Object} busData - Bus assignment data
   * @returns {Promise} Promise with assignment result
   */
  assignBusToEvent: async (id, busData) => {
    try {
      const response = await axiosInstance.post(`/events/${id}/assign-bus`, busData);
      return response.data;
    } catch (error) {
      console.error('Error in assignBusToEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign bus to event',
        data: null
      };
    }
  },

  /**
   * Update event status
   * @param {string} id - Event ID
   * @param {string} status - New status
   * @returns {Promise} Promise with status update result
   */
  updateEventStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/events/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error in updateEventStatus:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update event status',
        data: null
      };
    }
  },

  /**
   * Approve an event
   * @param {string} id - Event ID
   * @returns {Promise} Promise with approval result
   */
  approveEvent: async (id) => {
    try {
      const response = await axiosInstance.put(`/events/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error in approveEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve event',
        data: null
      };
    }
  },

  /**
   * Cancel an event
   * @param {string} id - Event ID
   * @returns {Promise} Promise with cancellation result
   */
  cancelEvent: async (id) => {
    try {
      const response = await axiosInstance.put(`/events/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error in cancelEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel event',
        data: null
      };
    }
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise} Promise with deletion result
   */
  deleteEvent: async (id) => {
    try {
      const response = await axiosInstance.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete event',
        data: null
      };
    }
  }
};

export default eventService;

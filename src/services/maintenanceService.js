import axiosInstance from '../utils/axiosConfig';

/**
 * Maintenance service for handling bus maintenance API calls
 */
const maintenanceService = {
  /**
   * Create maintenance record (admin only)
   * @param {Object} maintenanceData - Maintenance data
   * @returns {Promise} Promise with created maintenance data
   */
  createMaintenance: async (maintenanceData) => {
    try {
      const response = await axiosInstance.post('/maintenance', maintenanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create maintenance record' };
    }
  },

  /**
   * Get maintenance by ID
   * @param {string} id - Maintenance ID
   * @returns {Promise} Promise with maintenance data
   */
  getMaintenanceById: async (id) => {
    try {
      const response = await axiosInstance.get(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance details' };
    }
  },

  /**
   * Get maintenance by bus ID
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with maintenance data
   */
  getMaintenanceByBusId: async (busId) => {
    try {
      const response = await axiosInstance.get(`/maintenance/buses/${busId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bus maintenance records' };
    }
  },

  /**
   * Get upcoming maintenance (admin only)
   * @returns {Promise} Promise with upcoming maintenance data
   */
  getUpcomingMaintenance: async () => {
    try {
      const response = await axiosInstance.get('/maintenance/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch upcoming maintenance' };
    }
  },

  /**
   * Get maintenance history for a bus
   * @param {string} busId - Bus ID
   * @returns {Promise} Promise with maintenance history
   */
  getMaintenanceHistory: async (busId) => {
    try {
      const response = await axiosInstance.get(`/maintenance/buses/${busId}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch maintenance history' };
    }
  },

  /**
   * Update maintenance record (admin only)
   * @param {string} id - Maintenance ID
   * @param {Object} maintenanceData - Updated maintenance data
   * @returns {Promise} Promise with updated maintenance data
   */
  updateMaintenance: async (id, maintenanceData) => {
    try {
      const response = await axiosInstance.put(`/maintenance/${id}`, maintenanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update maintenance record' };
    }
  },

  /**
   * Update maintenance status (admin only)
   * @param {string} id - Maintenance ID
   * @param {Object} statusData - Status update data
   * @returns {Promise} Promise with updated status
   */
  updateMaintenanceStatus: async (id, statusData) => {
    try {
      const response = await axiosInstance.put(`/maintenance/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update maintenance status' };
    }
  },

  /**
   * Mark maintenance as completed (admin only)
   * @param {string} id - Maintenance ID
   * @param {Object} completionData - Completion data
   * @returns {Promise} Promise with completion result
   */
  markMaintenanceAsCompleted: async (id, completionData) => {
    try {
      const response = await axiosInstance.put(`/maintenance/${id}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark maintenance as completed' };
    }
  },

  /**
   * Schedule maintenance for a bus (admin only)
   * @param {string} busId - Bus ID
   * @param {Object} scheduleData - Maintenance schedule data
   * @returns {Promise} Promise with scheduled maintenance data
   */
  scheduleMaintenance: async (busId, scheduleData) => {
    try {
      const response = await axiosInstance.post(`/maintenance/buses/${busId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to schedule maintenance' };
    }
  },

  /**
   * Get all maintenance records (admin only)
   * @returns {Promise} Promise with all maintenance data
   */
  getAllMaintenance: async () => {
    try {
      const response = await axiosInstance.get('/maintenance');
      return response.data;
    } catch (error) {
      console.error('Error in getAllMaintenance:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch maintenance records',
        data: []
      };
    }
  },

  /**
   * Delete maintenance record (admin only)
   * @param {string} id - Maintenance ID
   * @returns {Promise} Promise with deletion result
   */
  deleteMaintenance: async (id) => {
    try {
      const response = await axiosInstance.delete(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in deleteMaintenance:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete maintenance record',
        data: null
      };
    }
  },

  /**
   * Update maintenance status with simple status string (admin only)
   * @param {string} id - Maintenance ID
   * @param {string} status - New status
   * @returns {Promise} Promise with updated status
   */
  updateMaintenanceStatusSimple: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/maintenance/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error in updateMaintenanceStatusSimple:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update maintenance status',
        data: null
      };
    }
  }
};

export default maintenanceService;

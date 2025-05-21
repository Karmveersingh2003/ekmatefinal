import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTools, FaBus, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { maintenanceService, busService } from '../../services';
import './AdminMaintenance.css';

const AdminMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBus, setFilterBus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState(null);
  const [formData, setFormData] = useState({
    busId: '',
    maintenanceType: 'routine',
    description: '',
    scheduledDate: '',
    estimatedCompletionDate: '',
    status: 'scheduled',
    cost: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMaintenance();
    fetchBuses();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await maintenanceService.getAllMaintenance();
      if (response.success) {
        // Extract maintenanceRecords from the response data
        setMaintenance(response.data.maintenanceRecords || []);
      } else {
        setError(response.message || 'Failed to fetch maintenance records');
      }
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      setError('An error occurred while fetching maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await busService.getAllBuses();
      if (response.success && response.data && response.data.buses) {
        setBuses(response.data.buses);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMaintenance();
  };

  const handleAddMaintenance = () => {
    setFormData({
      busId: '',
      maintenanceType: 'routine',
      description: '',
      scheduledDate: '',
      estimatedCompletionDate: '',
      status: 'scheduled',
      cost: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setCurrentMaintenance(maintenance);
    setFormData({
      busId: maintenance.busId,
      maintenanceType: maintenance.maintenanceType,
      description: maintenance.description,
      scheduledDate: maintenance.scheduledDate ? new Date(maintenance.scheduledDate).toISOString().split('T')[0] : '',
      estimatedCompletionDate: maintenance.estimatedCompletionDate ? new Date(maintenance.estimatedCompletionDate).toISOString().split('T')[0] : '',
      status: maintenance.status,
      cost: maintenance.cost || '',
      notes: maintenance.notes || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteMaintenance = (maintenance) => {
    setCurrentMaintenance(maintenance);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let response;
      if (showAddModal) {
        response = await maintenanceService.createMaintenance(formData);
      } else if (showEditModal && currentMaintenance) {
        response = await maintenanceService.updateMaintenance(currentMaintenance._id, formData);
      }

      if (response && response.success) {
        setSuccess(showAddModal ? 'Maintenance record created successfully' : 'Maintenance record updated successfully');
        setShowAddModal(false);
        setShowEditModal(false);
        fetchMaintenance();
      } else {
        setError(response?.message || 'Failed to save maintenance record');
      }
    } catch (error) {
      console.error('Error saving maintenance record:', error);
      setError('An error occurred while saving maintenance record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentMaintenance) return;

    setSubmitting(true);
    try {
      const response = await maintenanceService.deleteMaintenance(currentMaintenance._id);
      if (response && response.success) {
        setSuccess('Maintenance record deleted successfully');
        setShowDeleteModal(false);
        fetchMaintenance();
      } else {
        setError(response?.message || 'Failed to delete maintenance record');
      }
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      setError('An error occurred while deleting maintenance record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async (maintenance) => {
    try {
      const response = await maintenanceService.updateMaintenanceStatus(maintenance._id, 'completed');
      if (response && response.success) {
        setSuccess('Maintenance marked as completed');
        fetchMaintenance();
      } else {
        setError(response?.message || 'Failed to update maintenance status');
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error);
      setError('An error occurred while updating maintenance status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled': return <Badge bg="info">Scheduled</Badge>;
      case 'in_progress': return <Badge bg="warning" text="dark">In Progress</Badge>;
      case 'completed': return <Badge bg="success">Completed</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getMaintenanceTypeBadge = (type) => {
    switch (type) {
      case 'routine': return <Badge bg="primary">Routine</Badge>;
      case 'repair': return <Badge bg="danger">Repair</Badge>;
      case 'inspection': return <Badge bg="info">Inspection</Badge>;
      case 'emergency': return <Badge bg="warning" text="dark">Emergency</Badge>;
      default: return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const getBusName = (busId) => {
    const bus = buses.find(b => b._id === busId);
    return bus ? bus.busNumber : 'Unknown Bus';
  };

  const filteredMaintenance = maintenance.filter(item => {
    // Apply status filter
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;

    // Apply bus filter
    if (filterBus && item.busId !== filterBus) return false;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="admin-maintenance">
      <div className="page-title">
        <h1>Maintenance Management</h1>
        <Button variant="primary" onClick={handleAddMaintenance}>
          <FaPlus className="me-2" /> Schedule Maintenance
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Card className="admin-card mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col lg={5} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by description or notes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Bus</Form.Label>
                  <Form.Select
                    value={filterBus}
                    onChange={(e) => setFilterBus(e.target.value)}
                  >
                    <option value="">All Buses</option>
                    {buses.map(bus => (
                      <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={1} md={6} className="mb-3 d-flex align-items-end">
                <Button type="submit" variant="primary" className="w-100">
                  <FaSearch />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="admin-card">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading maintenance records...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Scheduled Date</th>
                  <th>Est. Completion</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenance.length > 0 ? (
                  filteredMaintenance.map((item) => (
                    <tr key={item._id}>
                      <td>{getBusName(item.busId)}</td>
                      <td>{getMaintenanceTypeBadge(item.maintenanceType)}</td>
                      <td>{item.description}</td>
                      <td>{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Not set'}</td>
                      <td>{item.estimatedCompletionDate ? new Date(item.estimatedCompletionDate).toLocaleDateString() : 'Not set'}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditMaintenance(item)}>
                          <FaEdit /> Edit
                        </Button>
                        {item.status !== 'completed' && (
                          <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleMarkComplete(item)}>
                            <FaCheck /> Complete
                          </Button>
                        )}
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMaintenance(item)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No maintenance records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Maintenance Modal */}
      <Modal show={showAddModal || showEditModal} onHide={() => {
        setShowAddModal(false);
        setShowEditModal(false);
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{showAddModal ? 'Schedule Maintenance' : 'Edit Maintenance'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus</Form.Label>
                  <Form.Select
                    name="busId"
                    value={formData.busId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Bus</option>
                    {buses.map(bus => (
                      <option key={bus._id} value={bus._id}>{bus.busNumber}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Maintenance Type</Form.Label>
                  <Form.Select
                    name="maintenanceType"
                    value={formData.maintenanceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="routine">Routine</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Completion Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="estimatedCompletionDate"
                    value={formData.estimatedCompletionDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Cost (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    placeholder="Enter cost in rupees"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes or details"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : (showAddModal ? 'Schedule Maintenance' : 'Save Changes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this maintenance record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Deleting...
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminMaintenance;

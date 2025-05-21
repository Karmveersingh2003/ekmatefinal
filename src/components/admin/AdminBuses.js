import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';
import { busService } from '../../services';
import { useToast } from '../../context/ToastContext';
import BusRouteManager from './BusRouteManager';
import './AdminBuses.css';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    busNumber: '',
    capacity: '',
    status: 'active',
    destination: '',
    currentPassengers: 0,
    lastMaintenance: '',
    nextMaintenance: '',
    fuelType: 'diesel',
    fuelEfficiency: 0,
    features: {
      wheelchairAccessible: false,
      airConditioned: false,
      wifi: false
    },
    routes: [],
    currentLocation: {
      latitude: 0,
      longitude: 0,
      lastUpdated: new Date().toISOString()
    }
  });

  // State to store all buses
  const [allBuses, setAllBuses] = useState([]);

  useEffect(() => {
    fetchAllBuses();
  }, []);

  // Fetch all buses once on component mount
  const fetchAllBuses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await busService.getAllBuses();

      if (response && response.success && response.data && response.data.buses) {
        setAllBuses(response.data.buses);
        setBuses(response.data.buses);
      } else {
        const errorMsg = response?.message || 'Failed to fetch buses';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
      const errorMsg = 'An error occurred while fetching buses';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter buses based on search query
  const filterBuses = () => {
    if (!searchQuery.trim()) {
      setBuses(allBuses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allBuses.filter(bus =>
      bus.busNumber?.toLowerCase().includes(query) ||
      bus.title?.toLowerCase().includes(query) ||
      bus.routes?.some(route => route.pickupPoint?.toLowerCase().includes(query)) ||
      bus.destination?.toLowerCase().includes(query)
    );

    setBuses(filtered);

    if (filtered.length > 0) {
      showSuccess(`Found ${filtered.length} buses matching "${searchQuery}"`);
    } else {
      showInfo(`No buses found matching "${searchQuery}"`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showInfo('Please enter a search term');
      setBuses(allBuses); // Reset to show all buses
      return;
    }

    showInfo(`Searching for "${searchQuery}"...`);
    filterBuses(); // Use client-side filtering
  };

  const handleAddBus = () => {
    setFormData({
      title: '',
      busNumber: '',
      capacity: '',
      status: 'active',
      destination: '',
      currentPassengers: 0,
      lastMaintenance: '',
      nextMaintenance: '',
      fuelType: 'diesel',
      fuelEfficiency: 0,
      features: {
        wheelchairAccessible: false,
        airConditioned: false,
        wifi: false
      },
      routes: [],
      currentLocation: {
        latitude: 0,
        longitude: 0,
        lastUpdated: new Date().toISOString()
      }
    });
    setShowAddModal(true);
  };

  const handleEditBus = (bus) => {
    setCurrentBus(bus);
    setFormData({
      title: bus.title || '',
      busNumber: bus.busNumber || '',
      capacity: bus.capacity || '',
      status: bus.status || 'active',
      destination: bus.destination || '',
      currentPassengers: bus.currentPassengers || 0,
      lastMaintenance: bus.lastMaintenance ? new Date(bus.lastMaintenance).toISOString().split('T')[0] : '',
      nextMaintenance: bus.nextMaintenance ? new Date(bus.nextMaintenance).toISOString().split('T')[0] : '',
      fuelType: bus.fuelType || 'diesel',
      fuelEfficiency: bus.fuelEfficiency || 0,
      features: {
        wheelchairAccessible: bus.features?.wheelchairAccessible || false,
        airConditioned: bus.features?.airConditioned || false,
        wifi: bus.features?.wifi || false
      },
      routes: bus.routes || [],
      currentLocation: bus.currentLocation || {
        latitude: 0,
        longitude: 0,
        lastUpdated: new Date().toISOString()
      }
    });
    setShowEditModal(true);
  };

  const handleDeleteBus = (bus) => {
    setCurrentBus(bus);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [name]: checked
      }
    });
  };

  const validateForm = () => {
    if (!formData.busNumber.trim()) {
      const errorMsg = 'Bus number is required';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      const errorMsg = 'Valid capacity is required';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      let response;

      if (showAddModal) {
        response = await busService.createBus(formData);
        if (response && response.success) {
          setShowAddModal(false);
          const successMsg = 'Bus added successfully';
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllBuses(); // Refresh all buses
        } else {
          const errorMsg = response?.message || 'Failed to add bus';
          setError(errorMsg);
          showError(errorMsg);
        }
      } else if (showEditModal && currentBus) {
        response = await busService.updateBus(currentBus._id, formData);
        if (response && response.success) {
          setShowEditModal(false);
          const successMsg = 'Bus updated successfully';
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllBuses(); // Refresh all buses
        } else {
          const errorMsg = response?.message || 'Failed to update bus';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error submitting bus data:', error);
      const errorMsg = 'An error occurred while saving bus data';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentBus) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await busService.deleteBus(currentBus._id);
      if (response && response.success) {
        setShowDeleteModal(false);
        const successMsg = `Bus #${currentBus.busNumber} deleted successfully`;
        setSuccessMessage(successMsg);
        showSuccess(successMsg);
        fetchAllBuses(); // Refresh all buses
      } else {
        const errorMsg = response?.message || 'Failed to delete bus';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
      const errorMsg = 'An error occurred while deleting bus';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge bg="success">Active</Badge>;
      case 'inactive': return <Badge bg="danger">Inactive</Badge>;
      case 'maintenance': return <Badge bg="warning" text="dark">Maintenance</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Real-time filtering when searchQuery changes
  useEffect(() => {
    // Only filter if we have buses loaded and a search query
    if (searchQuery.trim() && allBuses.length > 0) {
      filterBuses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allBuses.length]);

  return (
    <div className="admin-buses">
      <div className="page-title">
        <h1>Manage Buses</h1>
        <Button variant="primary" onClick={handleAddBus}>
          <FaPlus className="me-2" /> Add New Bus
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="admin-card mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Search Buses</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by bus number or route"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // If search field is cleared, show all buses
                        if (!e.target.value.trim()) {
                          setBuses(allBuses);
                        }
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary" className="w-100">
                  Search
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
              <p className="mt-3">Loading buses...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Bus No.</th>
                  <th>Title</th>
                  <th>Driver</th>
                  <th>Capacity</th>
                  <th>Destination</th>
                  <th>Routes</th>
                  <th>Status</th>
                  <th>Features</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses && buses.length > 0 ? (
                  buses.map((bus) => (
                    <tr key={bus._id}>
                      <td>{bus.busNumber}</td>
                      <td>{bus.title || '-'}</td>
                      <td>{bus.driver?.name || 'Not Assigned'}</td>
                      <td>{bus.capacity} {bus.currentPassengers ? `(${bus.currentPassengers} occupied)` : ''}</td>
                      <td>{bus.destination || '-'}</td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0"
                          title="View Routes"
                          onClick={() => {
                            setCurrentBus(bus);
                            setFormData({
                              ...formData,
                              routes: bus.routes || []
                            });
                            setShowRoutesModal(true);
                          }}
                        >
                          <FaRoute /> {bus.routes?.length || 0} Routes
                        </Button>
                      </td>
                      <td>{getStatusBadge(bus.status)}</td>
                      <td>
                        {bus.features?.wheelchairAccessible && <Badge bg="info" className="me-1">Wheelchair</Badge>}
                        {bus.features?.airConditioned && <Badge bg="info" className="me-1">AC</Badge>}
                        {bus.features?.wifi && <Badge bg="info">WiFi</Badge>}
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditBus(bus)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBus(bus)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No buses found. Add a new bus to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add Bus Modal */}
      <Modal show={showAddModal} onHide={() => !submitting && setShowAddModal(false)} size="lg">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Add New Bus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    placeholder="e.g., Campus Express"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    placeholder="e.g., CAMP-101"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Passengers</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentPassengers"
                    value={formData.currentPassengers}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="e.g., College Auditorium"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Next Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="nextMaintenance"
                    value={formData.nextMaintenance}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Efficiency (km/l)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="fuelEfficiency"
                    value={formData.fuelEfficiency}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={submitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Wheelchair Accessible"
                  name="wheelchairAccessible"
                  checked={formData.features.wheelchairAccessible}
                  onChange={handleFeatureChange}
                  className="mb-2"
                  disabled={submitting}
                />
                <Form.Check
                  type="checkbox"
                  label="Air Conditioned"
                  name="airConditioned"
                  checked={formData.features.airConditioned}
                  onChange={handleFeatureChange}
                  className="mb-2"
                  disabled={submitting}
                />
                <Form.Check
                  type="checkbox"
                  label="WiFi"
                  name="wifi"
                  checked={formData.features.wifi}
                  onChange={handleFeatureChange}
                  disabled={submitting}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Location</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.0001"
                      name="latitude"
                      value={formData.currentLocation.latitude}
                      onChange={(e) => setFormData({
                        ...formData,
                        currentLocation: {
                          ...formData.currentLocation,
                          latitude: parseFloat(e.target.value)
                        }
                      })}
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.0001"
                      name="longitude"
                      value={formData.currentLocation.longitude}
                      onChange={(e) => setFormData({
                        ...formData,
                        currentLocation: {
                          ...formData.currentLocation,
                          longitude: parseFloat(e.target.value)
                        }
                      })}
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>

            <BusRouteManager
              routes={formData.routes}
              onChange={(routes) => setFormData({...formData, routes})}
              disabled={submitting}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Bus'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Bus Modal */}
      <Modal show={showEditModal} onHide={() => !submitting && setShowEditModal(false)} size="lg">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Edit Bus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    placeholder="e.g., Campus Express"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    placeholder="e.g., CAMP-101"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Passengers</Form.Label>
                  <Form.Control
                    type="number"
                    name="currentPassengers"
                    value={formData.currentPassengers}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    disabled={submitting}
                    placeholder="e.g., College Auditorium"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Next Maintenance Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="nextMaintenance"
                    value={formData.nextMaintenance}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Efficiency (km/l)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="fuelEfficiency"
                    value={formData.fuelEfficiency}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={submitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Features</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Wheelchair Accessible"
                  name="wheelchairAccessible"
                  checked={formData.features.wheelchairAccessible}
                  onChange={handleFeatureChange}
                  className="mb-2"
                  disabled={submitting}
                />
                <Form.Check
                  type="checkbox"
                  label="Air Conditioned"
                  name="airConditioned"
                  checked={formData.features.airConditioned}
                  onChange={handleFeatureChange}
                  className="mb-2"
                  disabled={submitting}
                />
                <Form.Check
                  type="checkbox"
                  label="WiFi"
                  name="wifi"
                  checked={formData.features.wifi}
                  onChange={handleFeatureChange}
                  disabled={submitting}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Location</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.0001"
                      name="latitude"
                      value={formData.currentLocation.latitude}
                      onChange={(e) => setFormData({
                        ...formData,
                        currentLocation: {
                          ...formData.currentLocation,
                          latitude: parseFloat(e.target.value)
                        }
                      })}
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.0001"
                      name="longitude"
                      value={formData.currentLocation.longitude}
                      onChange={(e) => setFormData({
                        ...formData,
                        currentLocation: {
                          ...formData.currentLocation,
                          longitude: parseFloat(e.target.value)
                        }
                      })}
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>

            <BusRouteManager
              routes={formData.routes}
              onChange={(routes) => setFormData({...formData, routes})}
              disabled={submitting}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => !submitting && setShowDeleteModal(false)}>
        <Modal.Header closeButton={!submitting}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete Bus #{currentBus?.busNumber}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Routes Modal */}
      <Modal show={showRoutesModal} onHide={() => setShowRoutesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Routes for Bus #{currentBus?.busNumber} - {currentBus?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData.routes && formData.routes.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pickup Point</th>
                  <th>Time</th>
                  <th>Est. Arrival</th>
                  <th>Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {formData.routes.map((route, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{route.pickupPoint}</td>
                    <td>{route.time}</td>
                    <td>{route.estimatedArrivalTime}</td>
                    <td>
                      {route.coordinates?.latitude}, {route.coordinates?.longitude}
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 ms-2"
                        onClick={() => window.open(`https://www.google.com/maps?q=${route.coordinates?.latitude},${route.coordinates?.longitude}`, '_blank')}
                      >
                        <FaMapMarkerAlt /> Map
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center py-4">No routes defined for this bus.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoutesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminBuses;

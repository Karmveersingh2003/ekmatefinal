import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { driverService } from '../../services';
import { useToast } from '../../context/ToastContext';
import './AdminDrivers.css';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    licenseNumber: '',
    licenseExpiry: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    dateOfBirth: '',
    drivingExperience: 0,
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllDrivers();
  }, []);

  // Fetch all drivers once on component mount
  const fetchAllDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await driverService.getAllDrivers();

      if (response && response.success) {
        // Access the drivers array from the nested structure
        const driversData = response.data.drivers || [];
        setAllDrivers(driversData);
        setDrivers(driversData);
      } else {
        const errorMsg = response?.message || 'Failed to fetch drivers';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      const errorMsg = 'An error occurred while fetching drivers';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter drivers based on search query
  const filterDrivers = () => {
    if (!searchQuery.trim()) {
      setDrivers(allDrivers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allDrivers.filter(driver =>
      driver.name?.toLowerCase().includes(query) ||
      driver.email?.toLowerCase().includes(query) ||
      driver.phone_number?.toLowerCase().includes(query) ||
      driver.licenseNumber?.toLowerCase().includes(query)
    );

    setDrivers(filtered);

    if (filtered.length > 0) {
      showSuccess(`Found ${filtered.length} drivers matching "${searchQuery}"`);
    } else {
      showInfo(`No drivers found matching "${searchQuery}"`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showInfo('Please enter a search term');
      setDrivers(allDrivers); // Reset to show all drivers
      return;
    }

    showInfo(`Searching for "${searchQuery}"...`);
    filterDrivers(); // Use client-side filtering
  };

  const handleAddDriver = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      licenseNumber: '',
      licenseExpiry: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      dateOfBirth: '',
      drivingExperience: 0,
      isActive: true
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditDriver = (driver) => {
    setCurrentDriver(driver);
    setFormData({
      name: driver.name || '',
      email: driver.email || '',
      phone_number: driver.phone_number || '',
      licenseNumber: driver.licenseNumber || '',
      licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split('T')[0] : '',
      address: {
        street: driver.address?.street || '',
        city: driver.address?.city || '',
        state: driver.address?.state || '',
        zipCode: driver.address?.zipCode || ''
      },
      dateOfBirth: driver.dateOfBirth ? new Date(driver.dateOfBirth).toISOString().split('T')[0] : '',
      drivingExperience: driver.drivingExperience || 0,
      isActive: driver.isActive !== false
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteDriver = (driver) => {
    setCurrentDriver(driver);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, '')))
      errors.phone_number = 'Phone number must be 10 digits';

    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!formData.licenseExpiry) errors.licenseExpiry = 'License expiry date is required';
    else if (new Date(formData.licenseExpiry) < new Date())
      errors.licenseExpiry = 'License expiry date must be in the future';

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const errorMsg = 'Please correct the errors in the form';
      showError(errorMsg);
    }

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let response;
      if (showAddModal) {
        response = await driverService.createDriver(formData);
        if (response && response.success) {
          setShowAddModal(false);
          const successMsg = `Driver ${formData.name} added successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllDrivers(); // Refresh all drivers
        } else {
          const errorMsg = response?.message || 'Failed to add driver';
          setError(errorMsg);
          showError(errorMsg);
        }
      } else if (showEditModal && currentDriver) {
        response = await driverService.updateDriver(currentDriver._id, formData);
        if (response && response.success) {
          setShowEditModal(false);
          const successMsg = `Driver ${formData.name} updated successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllDrivers(); // Refresh all drivers
        } else {
          const errorMsg = response?.message || 'Failed to update driver';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error submitting driver data:', error);
      const errorMsg = 'An error occurred while saving driver data';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDriver) return;

    setSubmitting(true);
    try {
      const response = await driverService.deleteDriver(currentDriver._id);
      if (response && response.success) {
        setShowDeleteModal(false);
        const successMsg = `Driver ${currentDriver.name} deleted successfully`;
        setSuccessMessage(successMsg);
        showSuccess(successMsg);
        fetchAllDrivers(); // Refresh all drivers
      } else {
        const errorMsg = response?.message || 'Failed to delete driver';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      const errorMsg = 'An error occurred while deleting driver';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isActive) => {
    return isActive ?
      <Badge bg="success">Active</Badge> :
      <Badge bg="danger">Inactive</Badge>;
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Real-time filtering when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() && allDrivers.length > 0) {
      filterDrivers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allDrivers.length]);

  return (
    <div className="admin-drivers">
      <div className="page-title">
        <h1>Manage Drivers</h1>
        <Button variant="primary" onClick={handleAddDriver}>
          <FaPlus className="me-2" /> Add New Driver
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4">
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
                  <Form.Label>Search Drivers</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, or phone number"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // If search field is cleared, show all drivers
                        if (!e.target.value.trim()) {
                          setDrivers(allDrivers);
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
              <p className="mt-3">Loading drivers...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>License</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <tr key={driver._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUserTie className="me-2 text-primary" />
                          {driver.name}
                        </div>
                      </td>
                      <td>
                        <div><FaEnvelope className="me-1" /> {driver.email}</div>
                        <div><FaPhone className="me-1" /> {driver.phone_number}</div>
                      </td>
                      <td>
                        <div><FaIdCard className="me-1" /> {driver.licenseNumber}</div>
                        <div><FaCalendarAlt className="me-1" /> Expires: {formatDate(driver.licenseExpiry)}</div>
                      </td>
                      <td>{driver.drivingExperience} years</td>
                      <td>{getStatusBadge(driver.isActive)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditDriver(driver)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDriver(driver)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No drivers found. Add a new driver to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add Driver Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name}
                    required
                  />
                  {formErrors.name && <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.email}
                    required
                  />
                  {formErrors.email && <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.phone_number}
                    required
                  />
                  {formErrors.phone_number && <Form.Control.Feedback type="invalid">{formErrors.phone_number}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.licenseNumber}
                    required
                  />
                  {formErrors.licenseNumber && <Form.Control.Feedback type="invalid">{formErrors.licenseNumber}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.licenseExpiry}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {formErrors.licenseExpiry && <Form.Control.Feedback type="invalid">{formErrors.licenseExpiry}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Driving Experience (years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="drivingExperience"
                    value={formData.drivingExperience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <h5 className="mt-3">Address Information</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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
              'Add Driver'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Driver Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Same form fields as Add Driver Modal */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.name}
                    required
                  />
                  {formErrors.name && <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.email}
                    required
                  />
                  {formErrors.email && <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.phone_number}
                    required
                  />
                  {formErrors.phone_number && <Form.Control.Feedback type="invalid">{formErrors.phone_number}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.licenseNumber}
                    required
                  />
                  {formErrors.licenseNumber && <Form.Control.Feedback type="invalid">{formErrors.licenseNumber}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="licenseExpiry"
                    value={formData.licenseExpiry}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.licenseExpiry}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {formErrors.licenseExpiry && <Form.Control.Feedback type="invalid">{formErrors.licenseExpiry}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Driving Experience (years)</Form.Label>
                  <Form.Control
                    type="number"
                    name="drivingExperience"
                    value={formData.drivingExperience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3 mt-4">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <h5 className="mt-3">Address Information</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete driver <strong>{currentDriver?.name}</strong>? This action cannot be undone.
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
    </div>
  );
};

export default AdminDrivers;

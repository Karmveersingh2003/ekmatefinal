import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaBus, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import { eventService, busService } from '../../services';
import { useToast } from '../../context/ToastContext';
import './AdminEvents.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 0,
    status: 'pending',
    assignedBuses: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllEvents();
    fetchBuses();
  }, []);

  // Fetch all events once on component mount
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getAllEvents();
      if (response && response.success) {
        // Access the events array from the nested structure
        const eventsData = response.data.events || response.data;
        const formattedEvents = Array.isArray(eventsData) ? eventsData.map(event => ({
          _id: event._id,
          title: event.eventName || event.title || 'Untitled Event',
          description: event.description || '',
          date: event.startDate || event.date || new Date(),
          time: event.startDate ?
            `${new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate || event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` :
            event.time || '',
          location: event.location || '',
          maxParticipants: event.expectedAttendees || event.maxParticipants || 0,
          participants: event.participants || [],
          status: event.status || 'pending',
          assignedBuses: event.assignedBuses || []
        })) : [];

        console.log('Formatted events:', formattedEvents);
        setAllEvents(formattedEvents);
        setEvents(formattedEvents);
      } else {
        const errorMsg = response?.message || 'Failed to fetch events';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      const errorMsg = 'An error occurred while fetching events';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search query
  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setEvents(allEvents);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allEvents.filter(event =>
      event.title?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      (event.date && new Date(event.date).toLocaleDateString().includes(query))
    );

    setEvents(filtered);

    if (filtered.length > 0) {
      showSuccess(`Found ${filtered.length} events matching "${searchQuery}"`);
    } else {
      showInfo(`No events found matching "${searchQuery}"`);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await busService.getAllBuses({ status: 'active' });
      if (response && response.success && response.data && response.data.buses) {
        setBuses(response.data.buses);
      } else {
        console.error('Failed to fetch buses:', response?.message);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showInfo('Please enter a search term');
      setEvents(allEvents); // Reset to show all events
      return;
    }

    showInfo(`Searching for "${searchQuery}"...`);
    filterEvents(); // Use client-side filtering
  };

  const handleAddEvent = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 0,
      status: 'pending',
      assignedBuses: []
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);

    // Extract time from the combined time string (e.g., "10:00 AM - 12:00 PM")
    let timeValue = '';
    if (event.time && event.time.includes(' - ')) {
      timeValue = event.time.split(' - ')[0].trim();
      // Convert from 12-hour format to 24-hour format for the time input
      const timeParts = timeValue.match(/(\d+):(\d+) (\w+)/);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = timeParts[2];
        const ampm = timeParts[3];

        if (ampm.toLowerCase() === 'pm' && hours < 12) {
          hours += 12;
        } else if (ampm.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }

        timeValue = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
    }

    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: timeValue || '',
      location: event.location || '',
      maxParticipants: event.maxParticipants || 0,
      status: event.status || 'pending',
      assignedBuses: event.assignedBuses?.map(bus => bus._id || bus) || []
    });

    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event) => {
    setCurrentEvent(event);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBusSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        assignedBuses: [...formData.assignedBuses, value]
      });
    } else {
      setFormData({
        ...formData,
        assignedBuses: formData.assignedBuses.filter(busId => busId !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Convert form data to backend format
      const eventData = {
        eventName: formData.title,
        description: formData.description,
        location: formData.location,
        expectedAttendees: parseInt(formData.maxParticipants) || 0,
        status: formData.status,
        assignedBuses: formData.assignedBuses
      };

      // Create Date objects for startDate and endDate
      if (formData.date && formData.time) {
        const [hours, minutes] = formData.time.split(':').map(Number);
        const startDate = new Date(formData.date);
        startDate.setHours(hours, minutes, 0);

        // Set endDate to 2 hours after startDate by default
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        eventData.startDate = startDate;
        eventData.endDate = endDate;
      }

      let response;
      if (showAddModal) {
        response = await eventService.createEvent(eventData);
        if (response && response.success) {
          setShowAddModal(false);
          const successMsg = `Event "${formData.title}" added successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllEvents(); // Refresh all events
        } else {
          const errorMsg = response?.message || 'Failed to add event';
          setError(errorMsg);
          showError(errorMsg);
        }
      } else if (showEditModal && currentEvent) {
        response = await eventService.updateEvent(currentEvent._id, eventData);
        if (response && response.success) {
          setShowEditModal(false);
          const successMsg = `Event "${formData.title}" updated successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllEvents(); // Refresh all events
        } else {
          const errorMsg = response?.message || 'Failed to update event';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error submitting event data:', error);
      const errorMsg = 'An error occurred while saving event data';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentEvent) return;

    setSubmitting(true);
    try {
      const response = await eventService.deleteEvent(currentEvent._id);
      if (response && response.success) {
        setShowDeleteModal(false);
        const successMsg = `Event "${currentEvent.title}" deleted successfully`;
        setSuccessMessage(successMsg);
        showSuccess(successMsg);
        fetchAllEvents(); // Refresh all events
      } else {
        const errorMsg = response?.message || 'Failed to delete event';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorMsg = 'An error occurred while deleting event';
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      case 'completed': return <Badge bg="info">Completed</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
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
    if (searchQuery.trim() && allEvents.length > 0) {
      filterEvents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allEvents.length]);

  return (
    <div className="admin-events">
      <div className="page-title">
        <h1>Manage Events</h1>
        <Button variant="primary" onClick={handleAddEvent}>
          <FaPlus className="me-2" /> Add New Event
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
                  <Form.Label>Search Events</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by title, location, or date"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // If search field is cleared, show all events
                        if (!e.target.value.trim()) {
                          setEvents(allEvents);
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
              <p className="mt-3">Loading events...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Participants</th>
                  <th>Buses</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-primary" />
                          {event.title}
                        </div>
                      </td>
                      <td>
                        <div>{formatDate(event.date)}</div>
                        <div>{event.time}</div>
                      </td>
                      <td>
                        <div><FaMapMarkerAlt className="me-1" /> {event.location}</div>
                      </td>
                      <td>
                        <div><FaUsers className="me-1" /> {event.participants?.length || 0} / {event.maxParticipants || 'Unlimited'}</div>
                      </td>
                      <td>
                        <div><FaBus className="me-1" /> {event.assignedBuses?.length || 0} buses</div>
                      </td>
                      <td>{getStatusBadge(event.status)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditEvent(event)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(event)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No events found. Add a new event to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add Event Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                    required
                  />
                  {formErrors.title && <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.description}
                    required
                  />
                  {formErrors.description && <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.date}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {formErrors.date && <Form.Control.Feedback type="invalid">{formErrors.date}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.time}
                    required
                  />
                  {formErrors.time && <Form.Control.Feedback type="invalid">{formErrors.time}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.location}
                    required
                  />
                  {formErrors.location && <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Participants</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    Leave 0 for unlimited participants
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign Buses</Form.Label>
                  <div className="bus-selection-list">
                    {buses.length > 0 ? (
                      buses.map((bus) => (
                        <div key={bus._id} className="bus-selection-item">
                          <Form.Check
                            type="checkbox"
                            id={`bus-${bus._id}`}
                            label={`Bus #${bus.busNumber} - Driver: ${bus.driver?.name || 'Not Assigned'}`}
                            value={bus._id}
                            checked={formData.assignedBuses.includes(bus._id)}
                            onChange={handleBusSelection}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">No active buses available</p>
                    )}
                  </div>
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
              'Add Event'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.title}
                    required
                  />
                  {formErrors.title && <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.description}
                    required
                  />
                  {formErrors.description && <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.date}
                    required
                  />
                  {formErrors.date && <Form.Control.Feedback type="invalid">{formErrors.date}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.time}
                    required
                  />
                  {formErrors.time && <Form.Control.Feedback type="invalid">{formErrors.time}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.location}
                    required
                  />
                  {formErrors.location && <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Participants</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <Form.Text className="text-muted">
                    Leave 0 for unlimited participants
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign Buses</Form.Label>
                  <div className="bus-selection-list">
                    {buses.length > 0 ? (
                      buses.map((bus) => (
                        <div key={bus._id} className="bus-selection-item">
                          <Form.Check
                            type="checkbox"
                            id={`edit-bus-${bus._id}`}
                            label={`Bus #${bus.busNumber} - Driver: ${bus.driver?.name || 'Not Assigned'}`}
                            value={bus._id}
                            checked={formData.assignedBuses.includes(bus._id)}
                            onChange={handleBusSelection}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0">No active buses available</p>
                    )}
                  </div>
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
          Are you sure you want to delete event <strong>{currentEvent?.title}</strong>? This action cannot be undone.
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

export default AdminEvents;

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaComments, FaReply, FaEye, FaFilter, FaStar } from 'react-icons/fa';
import { feedbackService, busService } from '../../services';
import './AdminFeedback.css';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBus, setFilterBus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedback();
    fetchBuses();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.getAllFeedback();
      if (response.success) {
        // Check if the data is in the expected format
        if (Array.isArray(response.data)) {
          setFeedback(response.data);
        } else if (response.data && response.data.feedback && Array.isArray(response.data.feedback)) {
          // If the data is nested in a 'feedback' property
          setFeedback(response.data.feedback);
        } else {
          // If the data is not in the expected format, set an empty array
          setFeedback([]);
          console.error('Feedback data is not in the expected format:', response.data);
          setError('Received unexpected data format from server');
        }
      } else {
        setError(response.message || 'Failed to fetch feedback');
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('An error occurred while fetching feedback');
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
    fetchFeedback();
  };

  const handleViewDetails = (feedback) => {
    setCurrentFeedback(feedback);
    setShowDetailsModal(true);
  };

  const handleRespond = (feedback) => {
    setCurrentFeedback(feedback);
    setResponseText(feedback.adminResponse || '');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await feedbackService.respondToFeedback(currentFeedback._id, {
        adminResponse: responseText,
        status: 'resolved'
      });

      if (response.success) {
        setSuccess('Response submitted successfully');
        setShowResponseModal(false);
        fetchFeedback();
      } else {
        setError(response.message || 'Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      setError('An error occurred while submitting response');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'under_review': return <Badge bg="info">Under Review</Badge>;
      case 'resolved': return <Badge bg="success">Resolved</Badge>;
      case 'dismissed': return <Badge bg="danger">Dismissed</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getFeedbackTypeBadge = (type) => {
    switch (type) {
      case 'general': return <Badge bg="primary">General</Badge>;
      case 'cleanliness': return <Badge bg="info">Cleanliness</Badge>;
      case 'driver': return <Badge bg="warning" text="dark">Driver</Badge>;
      case 'punctuality': return <Badge bg="success">Punctuality</Badge>;
      case 'mechanical': return <Badge bg="danger">Mechanical</Badge>;
      case 'safety': return <Badge bg="dark">Safety</Badge>;
      default: return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          {i <= rating ? <FaStar /> : <FaStar className="empty-star" />}
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  const getBusName = (busId) => {
    const bus = buses.find(b => b._id === busId);
    return bus ? bus.busNumber : 'Unknown Bus';
  };

  const filteredFeedback = feedback.filter(item => {
    // Apply status filter
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;

    // Apply bus filter
    if (filterBus && item.busId !== filterBus) return false;

    // Apply feedback type filter
    if (filterType && item.feedbackType !== filterType) return false;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (item.comments && item.comments.toLowerCase().includes(query)) ||
        (item.userId && item.userId.name && item.userId.name.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="admin-feedback">
      <div className="page-title">
        <h1>Manage Feedback</h1>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Card className="admin-card mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col lg={4} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by comment or user"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2} md={6} className="mb-3">
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
              <Col lg={2} md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Feedback Type</Form.Label>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="general">General</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="driver">Driver</option>
                    <option value="punctuality">Punctuality</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="safety">Safety</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={2} md={12} className="mb-3 d-flex align-items-end">
                <Button type="submit" variant="primary" className="w-100">
                  <FaFilter className="me-2" /> Filter
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
              <p className="mt-3">Loading feedback...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Bus</th>
                  <th>Type</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((item) => (
                    <tr key={item._id}>
                      <td>{item.userId?.name || (item.isAnonymous ? 'Anonymous' : 'Unknown User')}</td>
                      <td>{getBusName(item.busId)}</td>
                      <td>{getFeedbackTypeBadge(item.feedbackType)}</td>
                      <td>{renderStarRating(item.rating)}</td>
                      <td>{new Date(item.createdAt || item.tripDate).toLocaleDateString()}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>
                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewDetails(item)}>
                          <FaEye /> View
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => handleRespond(item)}>
                          <FaReply /> Respond
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No feedback found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Feedback Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Feedback Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFeedback && (
            <div className="feedback-details">
              <Row className="mb-3">
                <Col md={6}>
                  <h6>User</h6>
                  <p>{currentFeedback.userId?.name || (currentFeedback.isAnonymous ? 'Anonymous' : 'Unknown User')}</p>
                </Col>
                <Col md={6}>
                  <h6>Bus</h6>
                  <p>{getBusName(currentFeedback.busId)}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Type</h6>
                  <p>{getFeedbackTypeBadge(currentFeedback.feedbackType)}</p>
                </Col>
                <Col md={6}>
                  <h6>Status</h6>
                  <p>{getStatusBadge(currentFeedback.status)}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Rating</h6>
                  <p>{renderStarRating(currentFeedback.rating)}</p>
                </Col>
                <Col md={6}>
                  <h6>Date</h6>
                  <p>{new Date(currentFeedback.createdAt || currentFeedback.tripDate).toLocaleDateString()}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12}>
                  <h6>Comments</h6>
                  <p className="feedback-comments">{currentFeedback.comments}</p>
                </Col>
              </Row>
              {currentFeedback.adminResponse && (
                <Row>
                  <Col xs={12}>
                    <h6>Admin Response</h6>
                    <p className="admin-response">{currentFeedback.adminResponse}</p>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {currentFeedback && (
            <Button variant="primary" onClick={() => {
              setShowDetailsModal(false);
              handleRespond(currentFeedback);
            }}>
              Respond
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Response Modal */}
      <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFeedback && (
            <Form onSubmit={handleSubmitResponse}>
              <Form.Group className="mb-3">
                <Form.Label>Feedback from {currentFeedback.userId?.name || (currentFeedback.isAnonymous ? 'Anonymous' : 'Unknown User')}</Form.Label>
                <p className="feedback-preview">{currentFeedback.comments}</p>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Your Response</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  required
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitResponse}
            disabled={submitting || !responseText.trim()}
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Submitting...
              </>
            ) : 'Submit Response'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminFeedback;

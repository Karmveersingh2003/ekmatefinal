import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar, FaComments, FaBus, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { feedbackService, busService } from '../../../services';
import './Feedback.css';

const Feedback = () => {
  const { currentUser } = useAuth();
  const [buses, setBuses] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    busId: '',
    rating: 0,
    comments: '',
    feedbackType: 'general',
    tripDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    isAnonymous: false
  });

  // Fetch buses and user feedback
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch buses
        const busesResponse = await busService.getAllBuses();
        if (busesResponse.success) {
          // Check if response.data.buses is an array, if not, use an empty array
          const busesData = busesResponse.data && busesResponse.data.buses ? busesResponse.data.buses : [];

          if (busesData.length > 0) {
            setBuses(busesData);
          } else {
            setBuses([]);
            console.warn('No buses found in the database');
          }
        } else {
          setBuses([]);
          console.error('Failed to fetch buses:', busesResponse?.message);
          setError('Failed to load buses. Please try again later.');
        }

        // Fetch user feedback if user is logged in
        if (currentUser && currentUser.id) {
          try {
            const feedbackResponse = await feedbackService.getFeedbackByUserId(currentUser.id);
            if (feedbackResponse && feedbackResponse.success) {
              // Check if the data is in the expected format
              if (Array.isArray(feedbackResponse.data)) {
                setUserFeedback(feedbackResponse.data);
              } else if (feedbackResponse.data && feedbackResponse.data.feedback && Array.isArray(feedbackResponse.data.feedback)) {
                // If the data is nested in a 'feedback' property
                setUserFeedback(feedbackResponse.data.feedback);
              } else {
                // If the data is not in the expected format, set an empty array
                setUserFeedback([]);
                console.error('Feedback data is not in the expected format:', feedbackResponse.data);
              }
            } else {
              setUserFeedback([]);
              console.error('Failed to fetch user feedback:', feedbackResponse?.message);
            }
          } catch (feedbackError) {
            console.error('Error fetching feedback:', feedbackError);
            setUserFeedback([]);
            setError('Failed to load your previous feedback. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setBuses([]);
        setUserFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating selection
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.busId) {
      setError('Please select a bus');
      return;
    }

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const feedbackData = {
        ...formData,
        userId: currentUser.id
      };

      const response = await feedbackService.createFeedback(feedbackData);

      if (response.success) {
        setSuccess('Feedback submitted successfully!');
        // Reset form
        setFormData({
          busId: '',
          rating: 0,
          comments: '',
          feedbackType: 'general',
          tripDate: new Date().toISOString().split('T')[0],
          isAnonymous: false
        });

        // Refresh user feedback
        if (currentUser && currentUser.id) {
          const feedbackResponse = await feedbackService.getFeedbackByUserId(currentUser.id);
          if (feedbackResponse.success) {
            // Check if the data is in the expected format
            if (Array.isArray(feedbackResponse.data)) {
              setUserFeedback(feedbackResponse.data);
            } else if (feedbackResponse.data && feedbackResponse.data.feedback && Array.isArray(feedbackResponse.data.feedback)) {
              // If the data is nested in a 'feedback' property
              setUserFeedback(feedbackResponse.data.feedback);
            } else {
              // If the data is not in the expected format, set an empty array
              setUserFeedback([]);
              console.error('Feedback data is not in the expected format:', feedbackResponse.data);
            }
          }
        }
      } else {
        setError(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating component
  const renderStarRating = (rating, interactive = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <span
            key={i}
            onClick={() => handleRatingClick(i)}
            className={`star-rating ${i <= formData.rating ? 'active' : ''}`}
          >
            {i <= formData.rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-rating">
            {i <= rating ? <FaStar className="active" /> : <FaRegStar />}
          </span>
        );
      }
    }

    return <div className="d-flex">{stars}</div>;
  };

  return (
    <Container fluid>
      <div className="page-header">
        <h1>
          <FaComments className="me-2" />
          Feedback
        </h1>
        <p className="feedback-subtitle">Share your experience and help us improve our services</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="feedback-card">
              <Card.Header>
                <h5 className="mb-0">Submit Feedback</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Bus</Form.Label>
                    <Form.Select
                      name="busId"
                      value={formData.busId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select a bus --</option>
                      {buses.map(bus => (
                        <option key={bus._id} value={bus._id}>
                          {bus.busNumber} - {bus.title || 'No route assigned'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <div className="star-rating-container mb-2">
                      {renderStarRating(formData.rating, true)}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Trip Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="tripDate"
                      value={formData.tripDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Feedback Type</Form.Label>
                    <Form.Select
                      name="feedbackType"
                      value={formData.feedbackType}
                      onChange={handleChange}
                      required
                    >
                      <option value="general">General</option>
                      <option value="cleanliness">Cleanliness</option>
                      <option value="punctuality">Punctuality</option>
                      <option value="driver">Driver</option>
                      <option value="mechanical">Mechanical</option>
                      <option value="safety">Safety</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      placeholder="Share your experience or suggestions..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isAnonymous: e.target.checked
                      }))}
                      label="Submit feedback anonymously"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="feedback-card">
              <Card.Header>
                <h5 className="mb-0">Your Previous Feedback</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {Array.isArray(userFeedback) && userFeedback.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="no-results">You haven't submitted any feedback yet.</p>
                  </div>
                ) : (
                  <div className="feedback-list">
                    {Array.isArray(userFeedback) && userFeedback.map(feedback => {
                      const bus = buses.find(b => b._id === feedback.busId);

                      return (
                        <div key={feedback._id} className="feedback-item">
                          <div className="feedback-header">
                            <div>
                              <h6>
                                <FaBus className="me-2" />
                                {bus ? `${bus.busNumber} - ${bus.title || 'No route'}` : 'Unknown Bus'}
                              </h6>
                              <div className="feedback-meta">
                                <span className="feedback-date">
                                  {new Date(feedback.createdAt).toLocaleDateString()}
                                </span>
                                <Badge bg="secondary" className="ms-2">
                                  {feedback.feedbackType}
                                </Badge>
                              </div>
                            </div>
                            <div className="feedback-rating">
                              {renderStarRating(feedback.rating)}
                            </div>
                          </div>

                          <p className="feedback-comment">{feedback.comments}</p>

                          {feedback.adminResponse && (
                            <div className="feedback-response">
                              <div className="response-header">
                                <FaCheck className="me-2" />
                                <span>Response from Admin</span>
                              </div>
                              <p>{feedback.adminResponse}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Feedback;

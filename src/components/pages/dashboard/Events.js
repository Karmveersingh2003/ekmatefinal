import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaBus,
  FaInfoCircle
} from 'react-icons/fa';
import { eventService } from '../../../services';
import { useToast } from '../../../context/ToastContext';
import './Events.css';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError, showInfo } = useToast();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await eventService.getUpcomingEvents();

        if (response.success) {
          // Check if response.data is an array or if it has an events property that is an array
          const eventsArray = Array.isArray(response.data)
            ? response.data
            : (response.data && Array.isArray(response.data.events)
              ? response.data.events
              : []);

          if (eventsArray.length > 0) {
            // Transform the data to match our UI needs
            const formattedEvents = eventsArray.map(event => ({
              id: event._id,
              title: event.eventName || event.title,
              date: event.startDate || event.date,
              time: `${new Date(event.startDate || event.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })} - ${new Date(event.endDate || event.endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}`,
              location: event.location,
              description: event.description,
              type: event.eventType || 'cultural', // Default to cultural if not specified
              transportation: event.transportationAvailable || (event.transportationNeeds && Object.keys(event.transportationNeeds).length > 0) || false,
              image: event.image || 'https://via.placeholder.com/800x400'
            }));

            setEvents(formattedEvents);
            showSuccess('Events loaded successfully');
          } else {
            setEvents([]);
            showInfo('No upcoming events found');
          }
        } else {
          const errorMsg = 'Failed to fetch events. Please try again later.';
          setError(errorMsg);
          showError(errorMsg);
          console.error('Failed to fetch events:', response?.message);
        }
      } catch (error) {
        const errorMsg = 'An error occurred while fetching events. Please try again later.';
        setError(errorMsg);
        showError(errorMsg);
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showSuccess, showError, showInfo]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim() && filterType === 'all') {
      showInfo('Please enter a search term or select an event type');
      return;
    }

    // The filtering is done by the filteredEvents variable
    const results = events.filter(event => {
      const matchesSearch = !searchQuery.trim() ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterType === 'all' || event.type === filterType;

      return matchesSearch && matchesFilter;
    });

    if (results.length > 0) {
      showSuccess(`Found ${results.length} events matching your criteria`);
    } else {
      showInfo('No events found matching your criteria');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all' || event.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <Container fluid>
      <div className="page-header">
        <h1>Events</h1>
        <p className="text-muted">Discover upcoming events and transportation options</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={6} lg={5}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label>Search</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search events"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={4} lg={3}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Events</option>
                    <option value="cultural">Cultural</option>
                    <option value="academic">Academic</option>
                    <option value="sports">Sports</option>
                    <option value="networking">Networking</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4} lg={2}>
                <Button type="submit" variant="primary" className="w-100">
                  Search
                </Button>
              </Col>

              <Col md={4} lg={2}>
                <Button variant="outline-primary" className="w-100">
                  <FaCalendarAlt className="me-2" />
                  Calendar View
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading events...</span>
          </Spinner>
          <p className="mt-2">Loading events...</p>
        </div>
      ) : (
        <Row>
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Col key={event.id} lg={6} className="mb-4">
                <Card className="event-card h-100">
                  <div className="event-image-container">
                    <img src={event.image} alt={event.title} className="event-image" />
                    <Badge
                      bg={
                        event.type === 'cultural' ? 'primary' :
                        event.type === 'academic' ? 'info' :
                        event.type === 'sports' ? 'success' :
                        'secondary'
                      }
                      className="event-badge"
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                <Card.Body>
                  <Card.Title className="event-title">{event.title}</Card.Title>

                  <div className="event-details">
                    <div className="event-detail">
                      <FaCalendarAlt className="event-icon" />
                      <span>{new Date(event.date || new Date()).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>

                    <div className="event-detail">
                      <FaClock className="event-icon" />
                      <span>{event.time}</span>
                    </div>

                    <div className="event-detail">
                      <FaMapMarkerAlt className="event-icon" />
                      <span>{event.location}</span>
                    </div>

                    {event.transportation && (
                      <div className="event-detail">
                        <FaBus className="event-icon" />
                        <span>Transportation Available</span>
                      </div>
                    )}
                  </div>

                  <Card.Text className="event-description">
                    {event.description}
                  </Card.Text>

                  <div className="event-actions">
                    <Button variant="primary">
                      View Details
                    </Button>
                    {event.transportation && (
                      <Button variant="outline-primary">
                        View Bus Schedule
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
          ) : (
            <Col xs={12}>
              <Card className="text-center py-5">
                <Card.Body>
                  <div className="no-results">
                    <FaCalendarAlt className="no-results-icon" />
                    <h5>No events found</h5>
                    <p>Try changing your search criteria</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}

      <div className="info-box">
        <div className="info-icon">
          <FaInfoCircle />
        </div>
        <div className="info-content">
          <h5>Transportation for Events</h5>
          <p>
            Special bus services are available for most college events. Check the event details for transportation options and schedules.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Events;

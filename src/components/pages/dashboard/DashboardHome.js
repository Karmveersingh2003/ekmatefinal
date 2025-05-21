import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FaBus, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { busService, eventService, gpsLocationService } from '../../../services';
import './DashboardHome.css';

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const [upcomingBuses, setUpcomingBuses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeLocations, setActiveLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch buses
        const busesResponse = await busService.getAllBuses();
        console.log('Buses API Response:', busesResponse);

        if (busesResponse.success) {
          // Check if response.data contains buses property (pagination structure)
          const busesData = busesResponse.data.buses || busesResponse.data;
          console.log('Buses data extracted:', busesData);

          if (Array.isArray(busesData) && busesData.length > 0) {
            // Transform the data to match our UI needs
            const buses = busesData.map(bus => {
              console.log('Processing bus:', bus);
              // Get the first route's pickup point as the route name if available
              const routeName = bus.routes && bus.routes.length > 0
                ? `${bus.routes[0].pickupPoint} to ${bus.destination}`
                : bus.title || 'Unknown Route';

              // Get the first route's time as departure time if available
              const departureTime = bus.routes && bus.routes.length > 0
                ? bus.routes[0].time
                : 'TBD';

              return {
                id: bus._id,
                route: routeName,
                departureTime: departureTime,
                status: bus.status || 'On Time',
                availableSeats: bus.capacity - (bus.currentPassengers || 0)
              };
            });
            console.log('Transformed buses:', buses);
            setUpcomingBuses(buses.slice(0, 3)); // Show only first 3 buses
          } else {
            setUpcomingBuses([]);
            console.warn('No buses found in the database');
          }
        } else {
          setUpcomingBuses([]);
          console.error('Failed to fetch buses:', busesResponse.message);
        }

        // Fetch upcoming events
        const eventsResponse = await eventService.getUpcomingEvents();
        console.log('Events API Response:', eventsResponse);

        if (eventsResponse.success && eventsResponse.data) {
          // Check if the data is in the expected format with events property
          const eventsData = eventsResponse.data.events || eventsResponse.data;

          if (Array.isArray(eventsData) && eventsData.length > 0) {
            // Transform the data to match our UI needs
            const events = eventsData.map(event => {
              console.log('Processing event:', event);
              return {
                id: event._id,
                title: event.eventName, // Changed from title to eventName based on the model
                date: new Date(event.startDate).toLocaleDateString('en-US', { // Changed from date to startDate
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
                location: event.location,
                time: `${new Date(event.startDate).toLocaleTimeString('en-US', { // Changed from startTime to startDate
                  hour: '2-digit',
                  minute: '2-digit'
                })} - ${new Date(event.endDate).toLocaleTimeString('en-US', { // Changed from endTime to endDate
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
              };
            });
            console.log('Transformed events:', events);
            setUpcomingEvents(events.slice(0, 2)); // Show only first 2 events
          } else {
            setUpcomingEvents([]);
            console.error('No events found in the response data');
          }
        } else {
          setUpcomingEvents([]);
          console.error('Failed to fetch upcoming events or no events found:', eventsResponse?.message);
        }

        // Fetch active bus locations
        const locationsResponse = await gpsLocationService.getAllActiveLocations();
        if (locationsResponse.success && Array.isArray(locationsResponse.data)) {
          setActiveLocations(locationsResponse.data);
        } else {
          setActiveLocations([]);
          console.error('Failed to fetch active locations:', locationsResponse?.message);
        }

        // Set recent activity - this would typically come from an API
        // For now, we'll keep this as mock data until a proper API is available
        setRecentActivity([
          {
            id: 1,
            action: 'Reserved a seat',
            details: 'Bus #102 - Campus to City Center',
            time: '2 hours ago'
          },
          {
            id: 2,
            action: 'Viewed schedule',
            details: 'Weekly Bus Schedule',
            time: '1 day ago'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');

        // Clear all data on error
        setUpcomingBuses([]);
        setUpcomingEvents([]);
        setActiveLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0].split('.')[0] : 'Guest')}!</h1>
        <p className="text-muted">Here's what's happening today</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="dashboard-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaBus className="me-2" /> Upcoming Buses
                  </h5>
                  <Button variant="outline-primary" size="sm" href="/dashboard/schedules">
                    View All
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {upcomingBuses.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="no-results">No upcoming buses available</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 bus-table">
                        <thead>
                          <tr>
                            <th style={{color: 'inherit'}}>Route</th>
                            <th style={{color: 'inherit'}}>Departure</th>
                            <th style={{color: 'inherit'}}>Status</th>
                            <th style={{color: 'inherit'}}>Available Seats</th>
                            <th style={{color: 'inherit'}}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingBuses.map(bus => (
                            <tr key={bus.id}>
                              <td style={{color: 'inherit'}}>{bus.route}</td>
                              <td style={{color: 'inherit'}}>{bus.departureTime}</td>
                              <td>
                                <span className={`status-badge ${bus.status.includes('Delayed') ? 'delayed' : 'on-time'}`}>
                                  {bus.status}
                                </span>
                              </td>
                              <td style={{color: 'inherit'}}>{bus.availableSeats}</td>
                              <td>
                                <Button variant="primary" size="sm">Reserve</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="dashboard-card h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaCalendarAlt className="me-2" /> Upcoming Events
                  </h5>
                  <Button variant="outline-primary" size="sm" href="/dashboard/events">
                    View All
                  </Button>
                </Card.Header>
                <Card.Body className="p-0">
                  {upcomingEvents.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="no-results">No upcoming events available</p>
                    </div>
                  ) : (
                    upcomingEvents.map(event => (
                      <div key={event.id} className="event-item">
                        <h6>{event.title}</h6>
                        <div className="event-details">
                          <div className="event-detail">
                            <FaCalendarAlt className="event-icon" />
                            <span>{event.date}</span>
                          </div>
                          <div className="event-detail">
                            <FaClock className="event-icon" />
                            <span>{event.time}</span>
                          </div>
                          <div className="event-detail">
                            <FaMapMarkerAlt className="event-icon" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={4} className="mb-4">
              <Card className="dashboard-card h-100">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="quick-actions">
                    <Button
                      variant="outline-primary"
                      className="quick-action-btn"
                      onClick={() => window.location.href = '/dashboard/schedules'}
                    >
                      <FaBus className="quick-action-icon" />
                      <span>Reserve Seat</span>
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="quick-action-btn"
                      onClick={() => window.location.href = '/dashboard/schedules'}
                    >
                      <FaCalendarAlt className="quick-action-icon" />
                      <span>View Schedule</span>
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="quick-action-btn"
                      onClick={() => window.location.href = '/dashboard/track'}
                    >
                      <FaMapMarkerAlt className="quick-action-icon" />
                      <span>Track Bus</span>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card className="dashboard-card">
                <Card.Header>
                  <h5 className="mb-0">Recent Activity</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="activity-list">
                    {recentActivity.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="no-results">No recent activity</p>
                      </div>
                    ) : (
                      recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-content">
                            <h6>{activity.action}</h6>
                            <p>{activity.details}</p>
                          </div>
                          <div className="activity-time">
                            {activity.time}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DashboardHome;

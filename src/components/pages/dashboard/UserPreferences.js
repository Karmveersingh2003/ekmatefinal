import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { FaBell, FaRoute, FaCalendarAlt, FaTrash, FaPlus, FaSave, FaCog } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { userPreferencesService, busService } from '../../../services';
import './UserPreferences.css';

const UserPreferences = () => {
  const { currentUser } = useAuth();
  const [buses, setBuses] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    pushNotifications: false,
    importantAlerts: false
  });

  // Form state for favorite routes
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [newFavoriteRoute, setNewFavoriteRoute] = useState('');

  // Form state for class schedule
  const [classSchedule, setClassSchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
    location: ''
  });

  // Fetch user preferences and buses
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !currentUser.id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch buses
        const busesResponse = await busService.getAllBuses();
        if (busesResponse.success) {
          // Check if response.data.buses is an array, if not, use an empty array
          const busesData = busesResponse.data && busesResponse.data.buses ? busesResponse.data.buses : [];
          setBuses(busesData);
        } else {
          setBuses([]);
          console.warn('Failed to fetch buses:', busesResponse?.message);
        }

        // Fetch user preferences
        try {
          const preferencesResponse = await userPreferencesService.getUserPreferences(currentUser.id);
          if (preferencesResponse && preferencesResponse.success && preferencesResponse.data) {
            const userPrefs = preferencesResponse.data;
            setPreferences(userPrefs);

            // Set notification settings (convert from backend format to simplified format)
            if (userPrefs.notificationSettings) {
              const ns = userPrefs.notificationSettings;
              setNotificationSettings({
                emailNotifications: ns.emailNotifications?.enabled || false,
                pushNotifications: ns.pushNotifications?.enabled || false,
                importantAlerts: (
                  (ns.emailNotifications?.specialEvents ||
                   ns.pushNotifications?.busDelays ||
                   ns.pushNotifications?.specialEvents) || false
                )
              });
            }

            // Set favorite routes
            if (userPrefs.favoriteRoutes && Array.isArray(userPrefs.favoriteRoutes)) {
              setFavoriteRoutes(userPrefs.favoriteRoutes);
            }

            // Set class schedule
            if (userPrefs.classSchedule && Array.isArray(userPrefs.classSchedule)) {
              setClassSchedule(userPrefs.classSchedule);
            }
          } else {
            console.warn('No preferences data found');
            // Keep default empty values
          }
        } catch (preferencesError) {
          console.error('Error fetching preferences:', preferencesError);
          setError('Failed to load preferences. Please try again later.');
          // Keep default empty values
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load preferences. Please try again later.');

        // Set empty data on error
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle adding a new favorite route
  const handleAddFavoriteRoute = () => {
    if (!newFavoriteRoute) return;

    // Check if route already exists
    if (favoriteRoutes.some(route => route.busId === newFavoriteRoute)) {
      setError('This route is already in your favorites');
      return;
    }

    const selectedBus = buses.find(bus => bus._id === newFavoriteRoute);
    if (!selectedBus) return;

    const newRoute = {
      busId: selectedBus._id,
      routeName: selectedBus.title || 'Unknown Route',
      busNumber: selectedBus.busNumber
    };

    setFavoriteRoutes(prev => [...prev, newRoute]);
    setNewFavoriteRoute('');
  };

  // Handle removing a favorite route
  const handleRemoveFavoriteRoute = (busId) => {
    setFavoriteRoutes(prev => prev.filter(route => route.busId !== busId));
  };

  // Handle new schedule item changes
  const handleNewScheduleChange = (field, value) => {
    setNewScheduleItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding a new schedule item
  const handleAddScheduleItem = () => {
    if (!newScheduleItem.day || !newScheduleItem.startTime || !newScheduleItem.endTime) {
      setError('Please fill in day, start time, and end time for the schedule');
      return;
    }

    setClassSchedule(prev => [...prev, { ...newScheduleItem }]);

    // Reset the form
    setNewScheduleItem({
      day: 'Monday',
      startTime: '',
      endTime: '',
      location: ''
    });
  };

  // Handle removing a schedule item
  const handleRemoveScheduleItem = (index) => {
    setClassSchedule(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
      setError('You must be logged in to save preferences');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Convert simplified notification settings to the format expected by the backend
      const formattedNotificationSettings = {
        pushNotifications: {
          enabled: notificationSettings.pushNotifications,
          busDelays: notificationSettings.importantAlerts,
          routeChanges: notificationSettings.importantAlerts,
          approachingBus: notificationSettings.importantAlerts,
          specialEvents: notificationSettings.importantAlerts
        },
        emailNotifications: {
          enabled: notificationSettings.emailNotifications,
          dailySchedule: notificationSettings.importantAlerts,
          weeklySchedule: notificationSettings.importantAlerts,
          specialEvents: notificationSettings.importantAlerts
        }
      };

      const preferencesData = {
        notificationSettings: formattedNotificationSettings,
        favoriteRoutes,
        classSchedule: classSchedule.filter(cls => cls.startTime && cls.endTime) // Only save days with times
      };

      const response = await userPreferencesService.createOrUpdatePreferences(
        currentUser.id,
        preferencesData
      );

      if (response.success) {
        setSuccess('Preferences saved successfully!');
        setPreferences(response.data);
      } else {
        setError(response.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid>
      <div className="page-header">
        <h1>
          <FaCog className="me-2" />
          User Preferences
        </h1>
        <p className="preferences-subtitle">Customize your experience and preferences</p>
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
          <p className="mt-2">Loading preferences...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="preferences-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaBell className="me-2" />
                    Notification Settings
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Form.Check
                    type="switch"
                    id="emailNotifications"
                    name="emailNotifications"
                    label="Email Notifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />

                  <Form.Check
                    type="switch"
                    id="pushNotifications"
                    name="pushNotifications"
                    label="Push Notifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />

                  <Form.Check
                    type="switch"
                    id="importantAlerts"
                    name="importantAlerts"
                    label="Important Alerts"
                    checked={notificationSettings.importantAlerts}
                    onChange={handleNotificationChange}
                    className="mb-3"
                  />
                </Card.Body>
              </Card>

              <Card className="preferences-card mt-4">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaRoute className="me-2" />
                    Favorite Routes
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <Form.Select
                      value={newFavoriteRoute}
                      onChange={(e) => setNewFavoriteRoute(e.target.value)}
                      className="me-2"
                    >
                      <option value="">-- Select a route --</option>
                      {buses.map(bus => (
                        <option key={bus._id} value={bus._id}>
                          {bus.busNumber} - {bus.title || 'No route assigned'}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-primary"
                      onClick={handleAddFavoriteRoute}
                      disabled={!newFavoriteRoute}
                    >
                      <FaPlus />
                    </Button>
                  </div>

                  {favoriteRoutes.length === 0 ? (
                    <p className="no-results">No favorite routes added yet.</p>
                  ) : (
                    <ListGroup>
                      {favoriteRoutes.map(route => (
                        <ListGroup.Item
                          key={route.busId}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <Badge bg="primary" className="me-2">
                              {route.busNumber}
                            </Badge>
                            {route.routeName}
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFavoriteRoute(route.busId)}
                          >
                            <FaTrash />
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="preferences-card">
                <Card.Header>
                  <h5 className="mb-0">
                    <FaCalendarAlt className="me-2" />
                    Class Schedule
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="schedule-description mb-3">
                    Add your class schedule to get personalized bus recommendations.
                  </p>

                  {/* Add new schedule item form */}
                  <div className="add-schedule-form mb-4 p-3 border rounded">
                    <h6 className="mb-3">Add New Schedule</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Day</Form.Label>
                          <Form.Select
                            value={newScheduleItem.day}
                            onChange={(e) => handleNewScheduleChange('day', e.target.value)}
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={newScheduleItem.startTime}
                            onChange={(e) => handleNewScheduleChange('startTime', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>End Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={newScheduleItem.endTime}
                            onChange={(e) => handleNewScheduleChange('endTime', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Engineering Building"
                        value={newScheduleItem.location}
                        onChange={(e) => handleNewScheduleChange('location', e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="outline-primary"
                      onClick={handleAddScheduleItem}
                      className="w-100"
                    >
                      <FaPlus className="me-2" /> Add Schedule
                    </Button>
                  </div>

                  {/* Display existing schedule items */}
                  {classSchedule.length === 0 ? (
                    <p className="no-results">No class schedule items added yet.</p>
                  ) : (
                    <div className="schedule-list">
                      {classSchedule.map((item, index) => (
                        <div key={index} className="schedule-item mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">{item.day}</h6>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveScheduleItem(index)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                          <div className="schedule-details">
                            <p className="mb-1">
                              <strong>Time:</strong> {item.startTime} - {item.endTime}
                            </p>
                            {item.location && (
                              <p className="mb-0">
                                <strong>Location:</strong> {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default UserPreferences;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tab, Nav } from 'react-bootstrap';
import { 
  FaCog, 
  FaBell, 
  FaGlobe, 
  FaUniversalAccess, 
  FaLock, 
  FaCheck, 
  FaEye, 
  FaEyeSlash 
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import './UserSettings.css';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: {
      enabled: true,
      busDelays: true,
      routeChanges: true,
      approachingBus: true,
      specialEvents: true
    },
    emailNotifications: {
      enabled: true,
      dailySchedule: false,
      weeklySchedule: true,
      specialEvents: true
    }
  });
  
  const [languageSettings, setLanguageSettings] = useState({
    language: 'en'
  });
  
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    screenReader: false,
    textToSpeech: false,
    fontSize: 'medium'
  });
  
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user preferences from API
        const response = await axiosInstance.get(`/users/${currentUser.id}/preferences`);
        
        if (response.data.success) {
          const preferences = response.data.data;
          
          // Update notification settings if available
          if (preferences.notificationSettings) {
            setNotificationSettings(preferences.notificationSettings);
          }
          
          // Update language settings if available
          if (preferences.language) {
            setLanguageSettings({
              language: preferences.language
            });
          }
          
          // Update accessibility settings if available
          if (preferences.accessibilitySettings) {
            setAccessibilitySettings(preferences.accessibilitySettings);
          }
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        // Don't show error for missing preferences, just use defaults
        if (error.response?.status !== 404) {
          setError('Failed to load settings. Using default settings instead.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchUserSettings();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleNotificationChange = (category, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setLanguageSettings({
      language: e.target.value
    });
  };

  const handleAccessibilityChange = (setting, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordSettings(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const saveNotificationSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put(
        `/users/${currentUser.id}/notification-settings`,
        { notificationSettings }
      );

      if (response.data.success) {
        setSuccess('Notification settings saved successfully!');
      } else {
        setError(response.data.message || 'Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setError('Failed to save notification settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const saveLanguageSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put(
        `/users/${currentUser.id}/preferences`,
        { language: languageSettings.language }
      );

      if (response.data.success) {
        setSuccess('Language settings saved successfully!');
      } else {
        setError(response.data.message || 'Failed to save language settings');
      }
    } catch (error) {
      console.error('Error saving language settings:', error);
      setError('Failed to save language settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const saveAccessibilitySettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put(
        `/users/${currentUser.id}/preferences`,
        { accessibilitySettings }
      );

      if (response.data.success) {
        setSuccess('Accessibility settings saved successfully!');
      } else {
        setError(response.data.message || 'Failed to save accessibility settings');
      }
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
      setError('Failed to save accessibility settings. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordSettings.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.put('/users/change-password', {
        currentPassword: passwordSettings.currentPassword,
        newPassword: passwordSettings.newPassword
      });

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        // Reset password fields
        setPasswordSettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showPassword: false
        });
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="page-header">
        <h1>
          <FaCog className="me-2" />
          Settings
        </h1>
        <p className="settings-subtitle">Manage your account settings and preferences</p>
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
          <p className="mt-2">Loading settings...</p>
        </div>
      ) : (
        <Tab.Container id="settings-tabs" defaultActiveKey="notifications">
          <Row>
            <Col lg={3} md={4} className="mb-4">
              <Card className="settings-nav-card">
                <Card.Body className="p-0">
                  <Nav variant="pills" className="flex-column settings-nav">
                    <Nav.Item>
                      <Nav.Link eventKey="notifications">
                        <FaBell className="nav-icon" /> Notifications
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="language">
                        <FaGlobe className="nav-icon" /> Language
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="accessibility">
                        <FaUniversalAccess className="nav-icon" /> Accessibility
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security">
                        <FaLock className="nav-icon" /> Security
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={9} md={8}>
              <Tab.Content>
                <Tab.Pane eventKey="notifications">
                  <Card className="settings-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaBell className="me-2" />
                        Notification Settings
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <h6 className="settings-section-title">Push Notifications</h6>
                      <Form.Check
                        type="switch"
                        id="push-notifications"
                        label="Enable Push Notifications"
                        checked={notificationSettings.pushNotifications.enabled}
                        onChange={(e) => handleNotificationChange('pushNotifications', 'enabled', e.target.checked)}
                        className="mb-3"
                      />
                      
                      <div className="ms-4 mb-4">
                        <Form.Check
                          type="checkbox"
                          id="bus-delays"
                          label="Bus Delays"
                          checked={notificationSettings.pushNotifications.busDelays}
                          onChange={(e) => handleNotificationChange('pushNotifications', 'busDelays', e.target.checked)}
                          disabled={!notificationSettings.pushNotifications.enabled}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="route-changes"
                          label="Route Changes"
                          checked={notificationSettings.pushNotifications.routeChanges}
                          onChange={(e) => handleNotificationChange('pushNotifications', 'routeChanges', e.target.checked)}
                          disabled={!notificationSettings.pushNotifications.enabled}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="approaching-bus"
                          label="Approaching Bus"
                          checked={notificationSettings.pushNotifications.approachingBus}
                          onChange={(e) => handleNotificationChange('pushNotifications', 'approachingBus', e.target.checked)}
                          disabled={!notificationSettings.pushNotifications.enabled}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="special-events"
                          label="Special Events"
                          checked={notificationSettings.pushNotifications.specialEvents}
                          onChange={(e) => handleNotificationChange('pushNotifications', 'specialEvents', e.target.checked)}
                          disabled={!notificationSettings.pushNotifications.enabled}
                        />
                      </div>

                      <h6 className="settings-section-title">Email Notifications</h6>
                      <Form.Check
                        type="switch"
                        id="email-notifications"
                        label="Enable Email Notifications"
                        checked={notificationSettings.emailNotifications.enabled}
                        onChange={(e) => handleNotificationChange('emailNotifications', 'enabled', e.target.checked)}
                        className="mb-3"
                      />
                      
                      <div className="ms-4 mb-4">
                        <Form.Check
                          type="checkbox"
                          id="daily-schedule"
                          label="Daily Schedule"
                          checked={notificationSettings.emailNotifications.dailySchedule}
                          onChange={(e) => handleNotificationChange('emailNotifications', 'dailySchedule', e.target.checked)}
                          disabled={!notificationSettings.emailNotifications.enabled}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="weekly-schedule"
                          label="Weekly Schedule"
                          checked={notificationSettings.emailNotifications.weeklySchedule}
                          onChange={(e) => handleNotificationChange('emailNotifications', 'weeklySchedule', e.target.checked)}
                          disabled={!notificationSettings.emailNotifications.enabled}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          id="email-special-events"
                          label="Special Events"
                          checked={notificationSettings.emailNotifications.specialEvents}
                          onChange={(e) => handleNotificationChange('emailNotifications', 'specialEvents', e.target.checked)}
                          disabled={!notificationSettings.emailNotifications.enabled}
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <Button 
                          variant="primary" 
                          onClick={saveNotificationSettings}
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
                              <FaCheck className="me-2" /> Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="language">
                  <Card className="settings-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaGlobe className="me-2" />
                        Language Settings
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-4">
                        <Form.Label>Select Language</Form.Label>
                        <Form.Select
                          value={languageSettings.language}
                          onChange={handleLanguageChange}
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="gu">Gujarati</option>
                          <option value="mr">Marathi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                          <option value="kn">Kannada</option>
                          <option value="ml">Malayalam</option>
                          <option value="pa">Punjabi</option>
                          <option value="bn">Bengali</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          This will change the language of the application interface.
                        </Form.Text>
                      </Form.Group>

                      <div className="d-flex justify-content-end">
                        <Button 
                          variant="primary" 
                          onClick={saveLanguageSettings}
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
                              <FaCheck className="me-2" /> Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="accessibility">
                  <Card className="settings-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaUniversalAccess className="me-2" />
                        Accessibility Settings
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Check
                        type="switch"
                        id="high-contrast"
                        label="High Contrast Mode"
                        checked={accessibilitySettings.highContrast}
                        onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                        className="mb-3"
                      />
                      <Form.Check
                        type="switch"
                        id="screen-reader"
                        label="Screen Reader Compatibility"
                        checked={accessibilitySettings.screenReader}
                        onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
                        className="mb-3"
                      />
                      <Form.Check
                        type="switch"
                        id="text-to-speech"
                        label="Text to Speech"
                        checked={accessibilitySettings.textToSpeech}
                        onChange={(e) => handleAccessibilityChange('textToSpeech', e.target.checked)}
                        className="mb-4"
                      />

                      <Form.Group className="mb-4">
                        <Form.Label>Font Size</Form.Label>
                        <Form.Select
                          value={accessibilitySettings.fontSize}
                          onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium (Default)</option>
                          <option value="large">Large</option>
                          <option value="extra-large">Extra Large</option>
                        </Form.Select>
                      </Form.Group>

                      <div className="d-flex justify-content-end">
                        <Button 
                          variant="primary" 
                          onClick={saveAccessibilitySettings}
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
                              <FaCheck className="me-2" /> Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="security">
                  <Card className="settings-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <FaLock className="me-2" />
                        Security Settings
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <h6 className="settings-section-title">Change Password</h6>
                      <Form onSubmit={changePassword}>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <div className="password-input-container">
                            <Form.Control
                              type={passwordSettings.showPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordSettings.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <div className="password-input-container">
                            <Form.Control
                              type={passwordSettings.showPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordSettings.newPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Confirm New Password</Form.Label>
                          <div className="password-input-container">
                            <Form.Control
                              type={passwordSettings.showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordSettings.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <Button 
                              variant="link" 
                              className="password-toggle-btn"
                              onClick={togglePasswordVisibility}
                              type="button"
                            >
                              {passwordSettings.showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                          </div>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                          <Button 
                            type="submit" 
                            variant="primary"
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
                                Changing Password...
                              </>
                            ) : (
                              <>
                                <FaCheck className="me-2" /> Change Password
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </Container>
  );
};

export default UserSettings;

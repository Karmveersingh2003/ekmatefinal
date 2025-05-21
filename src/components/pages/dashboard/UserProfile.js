import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaGraduationCap, FaCalendarAlt, FaEdit, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosConfig';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    reg_number: '',
    branch: '',
    year: '',
    role: ''
  });

  // Extract username from email if name is not available
  const getUsernameFromEmail = (email) => {
    if (!email) return 'Guest';
    return email.split('@')[0].split('.')[0];
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the existing currentUser data or fetch from API if needed
        if (currentUser) {
          setProfile(currentUser);
          setFormData({
            name: currentUser.name || getUsernameFromEmail(currentUser.email),
            email: currentUser.email || '',
            phone_number: currentUser.phone_number || '',
            reg_number: currentUser.reg_number || '',
            branch: currentUser.branch || '',
            year: currentUser.year || '',
            role: currentUser.role || 'student'
          });
        } else {
          // Fetch user profile from API if currentUser doesn't have all the data
          const response = await axiosInstance.get('/users/me');
          if (response.data.success) {
            const userData = response.data.data;
            setProfile(userData);
            setFormData({
              name: userData.name || getUsernameFromEmail(userData.email),
              email: userData.email || '',
              phone_number: userData.phone_number || '',
              reg_number: userData.reg_number || '',
              branch: userData.branch || '',
              year: userData.year || '',
              role: userData.role || 'student'
            });
          } else {
            setError('Failed to fetch user profile');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Update user profile via API
      const response = await axiosInstance.put('/users/me', formData);

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setProfile(response.data.data);
        setEditMode(false);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Reset form data to current profile data if canceling edit
      setFormData({
        name: profile.name || getUsernameFromEmail(profile.email),
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        reg_number: profile.reg_number || '',
        branch: profile.branch || '',
        year: profile.year || '',
        role: profile.role || 'student'
      });
    }
    setEditMode(!editMode);
  };

  return (
    <Container>
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">View and manage your personal information</p>
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
          <p className="mt-2">Loading profile...</p>
        </div>
      ) : (
        <Row>
          <Col lg={4} className="mb-4">
            <Card className="profile-card">
              <Card.Body className="text-center">
                <div className="profile-avatar-large">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <h4 className="mt-3">{profile?.name || getUsernameFromEmail(profile?.email)}</h4>
                <p className="text-muted">{profile?.role || 'Student'}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <div className="stat-value">{profile?.branch || 'N/A'}</div>
                    <div className="stat-label">Branch</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{profile?.year || 'N/A'}</div>
                    <div className="stat-label">Year</div>
                  </div>
                </div>
                <Button
                  variant={editMode ? "outline-secondary" : "outline-primary"}
                  className="mt-3 w-100"
                  onClick={toggleEditMode}
                >
                  {editMode ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="profile-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Personal Information
                </h5>
                {!editMode && (
                  <Button variant="link" className="p-0" onClick={toggleEditMode}>
                    <FaEdit /> Edit
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {editMode ? (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
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
                            required
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Registration Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="reg_number"
                            value={formData.reg_number}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Branch</Form.Label>
                          <Form.Control
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Year</Form.Label>
                          <Form.Select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-3">
                      <Button variant="secondary" className="me-2" onClick={toggleEditMode}>
                        Cancel
                      </Button>
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-2" /> Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="profile-info">
                    <div className="info-item">
                      <div className="info-label">
                        <FaUser className="info-icon" />
                        Full Name
                      </div>
                      <div className="info-value">{profile?.name || getUsernameFromEmail(profile?.email)}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaEnvelope className="info-icon" />
                        Email
                      </div>
                      <div className="info-value">{profile?.email || 'Not provided'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaPhone className="info-icon" />
                        Phone Number
                      </div>
                      <div className="info-value">{profile?.phone_number || 'Not provided'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaIdCard className="info-icon" />
                        Registration Number
                      </div>
                      <div className="info-value">{profile?.reg_number || 'Not provided'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaGraduationCap className="info-icon" />
                        Branch
                      </div>
                      <div className="info-value">{profile?.branch || 'Not provided'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <FaCalendarAlt className="info-icon" />
                        Year
                      </div>
                      <div className="info-value">{profile?.year ? `${profile.year}${getOrdinalSuffix(profile.year)} Year` : 'Not provided'}</div>
                    </div>
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

// Helper function to get ordinal suffix for numbers
const getOrdinalSuffix = (num) => {
  const number = parseInt(num);
  if (isNaN(number)) return '';

  if (number === 1) return 'st';
  if (number === 2) return 'nd';
  if (number === 3) return 'rd';
  return 'th';
};

export default UserProfile;

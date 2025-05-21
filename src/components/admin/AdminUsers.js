import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaUserShield } from 'react-icons/fa';
import { userService } from '../../services';
import { useToast } from '../../context/ToastContext';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { showSuccess, showError, showInfo } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    reg_number: '',
    branch: '',
    year: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch all users once on component mount
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      if (response && response.success) {
        // Access the users array from the nested structure
        const usersData = response.data.users || response.data;
        const formattedUsers = Array.isArray(usersData) ? usersData : [];
        setAllUsers(formattedUsers);
        setUsers(formattedUsers);
      } else {
        const errorMsg = response?.message || 'Failed to fetch users';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMsg = 'An error occurred while fetching users';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setUsers(allUsers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allUsers.filter(user =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone_number?.toLowerCase().includes(query) ||
      user.reg_number?.toLowerCase().includes(query) ||
      user.branch?.toLowerCase().includes(query)
    );

    setUsers(filtered);

    if (filtered.length > 0) {
      showSuccess(`Found ${filtered.length} users matching "${searchQuery}"`);
    } else {
      showInfo(`No users found matching "${searchQuery}"`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showInfo('Please enter a search term');
      setUsers(allUsers); // Reset to show all users
      return;
    }

    showInfo(`Searching for "${searchQuery}"...`);
    filterUsers(); // Use client-side filtering
  };

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      reg_number: '',
      branch: '',
      year: '',
      role: 'student',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      reg_number: user.reg_number || '',
      branch: user.branch || '',
      year: user.year || '',
      role: user.role || 'student',
      // Don't set password for editing
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number.replace(/\D/g, '')))
      errors.phone_number = 'Phone number must be 10 digits';

    // Password validation only for adding new user
    if (showAddModal) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let response;
      if (showAddModal) {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;
        response = await userService.createUser(userData);
        if (response && response.success) {
          setShowAddModal(false);
          const successMsg = `User ${userData.name} added successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllUsers(); // Refresh all users
        } else {
          const errorMsg = response?.message || 'Failed to add user';
          setError(errorMsg);
          showError(errorMsg);
        }
      } else if (showEditModal && currentUser) {
        // Remove password fields if empty
        const userData = { ...formData };
        if (!userData.password) {
          delete userData.password;
          delete userData.confirmPassword;
        } else {
          delete userData.confirmPassword;
        }

        response = await userService.updateUser(currentUser._id, userData);
        if (response && response.success) {
          setShowEditModal(false);
          const successMsg = `User ${userData.name} updated successfully`;
          setSuccessMessage(successMsg);
          showSuccess(successMsg);
          fetchAllUsers(); // Refresh all users
        } else {
          const errorMsg = response?.message || 'Failed to update user';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error submitting user data:', error);
      const errorMsg = 'An error occurred while saving user data';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const response = await userService.deleteUser(currentUser._id);
      if (response && response.success) {
        setShowDeleteModal(false);
        const successMsg = `User ${currentUser.name} deleted successfully`;
        setSuccessMessage(successMsg);
        showSuccess(successMsg);
        fetchAllUsers(); // Refresh all users
      } else {
        const errorMsg = response?.message || 'Failed to delete user';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMsg = 'An error occurred while deleting user';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge bg="danger">Admin</Badge>;
      case 'faculty': return <Badge bg="info">Faculty</Badge>;
      case 'student': return <Badge bg="success">Student</Badge>;
      default: return <Badge bg="secondary">{role}</Badge>;
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
    if (searchQuery.trim() && allUsers.length > 0) {
      filterUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, allUsers.length]);

  return (
    <div className="admin-users">
      <div className="page-title">
        <h1>Manage Users</h1>
        <Button variant="primary" onClick={handleAddUser}>
          <FaPlus className="me-2" /> Add New User
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
                  <Form.Label>Search Users</Form.Label>
                  <div className="search-input">
                    <FaSearch className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, or registration number"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // If search field is cleared, show all users
                        if (!e.target.value.trim()) {
                          setUsers(allUsers);
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
              <p className="mt-3">Loading users...</p>
            </div>
          ) : (
            <Table responsive className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Academic Info</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUser className="me-2 text-primary" />
                          {user.name}
                        </div>
                      </td>
                      <td>
                        <div><FaEnvelope className="me-1" /> {user.email}</div>
                        {user.phone_number && <div><FaPhone className="me-1" /> {user.phone_number}</div>}
                      </td>
                      <td>
                        {user.reg_number && <div><FaGraduationCap className="me-1" /> Reg: {user.reg_number}</div>}
                        {user.branch && <div>Branch: {user.branch}</div>}
                        {user.year && <div>Year: {user.year}</div>}
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditUser(user)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user)}>
                          <FaTrash /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found. Add a new user to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
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
                  />
                  {formErrors.phone_number && <Form.Control.Feedback type="invalid">{formErrors.phone_number}</Form.Control.Feedback>}
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
                  <Form.Control
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.password}
                    required
                  />
                  {formErrors.password && <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.confirmPassword}
                    required
                  />
                  {formErrors.confirmPassword && <Form.Control.Feedback type="invalid">{formErrors.confirmPassword}</Form.Control.Feedback>}
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
              'Add User'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
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
                  />
                  {formErrors.phone_number && <Form.Control.Feedback type="invalid">{formErrors.phone_number}</Form.Control.Feedback>}
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
                  <Form.Control
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password (leave blank to keep current)</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.password}
                  />
                  {formErrors.password && <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.confirmPassword}
                  />
                  {formErrors.confirmPassword && <Form.Control.Feedback type="invalid">{formErrors.confirmPassword}</Form.Control.Feedback>}
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
          Are you sure you want to delete user <strong>{currentUser?.name}</strong>? This action cannot be undone.
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

export default AdminUsers;

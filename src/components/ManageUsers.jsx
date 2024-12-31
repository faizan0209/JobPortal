import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from './Firebase'; 
import { app } from './Firebase';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material'; // Import Box from MUI

const ManageUsers = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  });

  const db = getFirestore(app);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        // Map the data to include username, email, and role
        const userData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username,
          email: doc.data().email,
          role: doc.data().role || 'user' // Default role if not set
        }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Promote user to admin
  const handlePromote = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: 'admin' });
      alert(`User ${userId} promoted to admin.`);
      setUsers(users.map(user => user.id === userId ? { ...user, role: 'admin' } : user));
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  };

  // Deactivate user
  const handleDeactivate = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { active: false });
      alert(`User ${userId} deactivated.`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert(`User ${userId} deleted.`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <h2 className="text-center text-primary">Manage Users</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Loading users...</p>
                </div>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Table striped bordered hover responsive className="mx-auto">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            {user.role !== 'admin' && (
                              <Button
                                onClick={() => handlePromote(user.id)}
                                variant="success"
                                className="me-2"
                              >
                                Promote
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeactivate(user.id)}
                              variant="danger"
                              className="me-2"
                            >
                              Deactivate
                            </Button>
                            <Button
                              onClick={() => handleDelete(user.id)}
                              variant="warning"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Box>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageUsers;

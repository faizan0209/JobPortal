import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'; // Import Firestore methods
// import { app } from './Firebase'; // Ensure your Firebase config is imported
import { app } from './Firebase';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';


const ManageUsers = () => {
    const {currentUser}=useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  });

    const db = getFirestore(app); // Initialize Firestore

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                // Map the data to include only username and email
                const userData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    username: doc.data().username, // Extract username
                    email: doc.data().email       // Extract email
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
                                <Table striped bordered hover responsive>
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
                                                    <Button
                                                        onClick={() => handlePromote(user.id)}
                                                        variant="success"
                                                        className="me-2"
                                                        disabled={user.role === 'admin'}
                                                    >
                                                        Promote
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeactivate(user.id)}
                                                        variant="danger"
                                                    >
                                                        Deactivate
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageUsers;

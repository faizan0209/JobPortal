import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert, Card, Row, Col, Modal } from 'react-bootstrap';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PostJob = () => {
    const {currentUser}=useAuth();
    useEffect(() => {
        if (!currentUser) {
          navigate("/login");
        }
      });

    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        salary: '',
        requirements: '',
    });
    const [jobs, setJobs] = useState([]); // Store jobs from Firestore
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [selectedJob, setSelectedJob] = useState(null); // Currently selected job for modal
    const [editingJob, setEditingJob] = useState(null); // Currently editing job
    const navigate = useNavigate()

    // Fetch jobs from Firestore on component mount
    useEffect(() => {
        const fetchJobs = async () => {
            const querySnapshot = await getDocs(collection(db, 'jobs'));
            const jobsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setJobs(jobsArray);
        };
        fetchJobs();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingJob) {
                // Update job
                await updateDoc(doc(db, 'jobs', editingJob.id), jobData);
                setJobs(jobs.map((job) => (job.id === editingJob.id ? { ...job, ...jobData } : job)));
                setEditingJob(null);
                setSuccessMessage('Job Updated Successfully!');
            } else {
                // Add new job
                const docRef = await addDoc(collection(db, 'jobs'), jobData);
                setJobs([...jobs, { id: docRef.id, ...jobData }]);
                setSuccessMessage('Job Posted Successfully!');
            }
            setErrorMessage('');
            setJobData({ title: '', description: '', salary: '', requirements: '' });
            await navigate('/admin');
            console.log('Still here!');
        } catch (error) {
            console.error('Error posting job:', error);
            setErrorMessage('There was an error posting the job. Please try again.');
            setSuccessMessage('');
        }
    };

    // Handle delete job
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'jobs', id));
            setJobs(jobs.filter((job) => job.id !== id));
            setSuccessMessage('Job Deleted Successfully!');
        } catch (error) {
            console.error('Error deleting job:', error);
            setErrorMessage('There was an error deleting the job.');
        }
    };

    // Handle edit job
    const handleEdit = (job) => {
        setEditingJob(job);
        setJobData({ title: job.title, description: job.description, salary: job.salary, requirements: job.requirements });
    };

    return (
        <Container className="my-5" style={{ paddingTop: "5rem" }}> {/* Adjust padding for sticky navbar */}
        <h1>Job Post</h1>
            {/* Success and Error Alerts */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {/* Job Posting Form */}
            <Form onSubmit={handleSubmit} className="shadow p-4 mb-5 bg-light rounded">
                <h4 className="mb-4 text-primary">
                    {editingJob ? 'Edit Job' : 'Post a Job'}
                </h4>
                <Form.Group className="mb-3" controlId="formJobTitle">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        placeholder="Enter job title"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formJobDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={jobData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter job description"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSalary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="text"
                        name="salary"
                        value={jobData.salary}
                        onChange={handleChange}
                        placeholder="Enter salary"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRequirements">
                    <Form.Label>Requirements</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="requirements"
                        value={jobData.requirements}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter job requirements"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    {editingJob ? 'Update Job' : 'Post Job'}
                </Button>
            </Form>

            {/* Job Cards Section */}
            <h3 className="my-4 text-center text-primary">Available Job Posts</h3>
            <Row xs={1} md={2} lg={3} className="g-4">
                {jobs.map((job) => (
                    <Col key={job.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="text-primary text-center mb-3">
                                    {job.title}
                                </Card.Title>
                                <Card.Text>
                                    <strong>Salary:</strong> {job.salary}
                                </Card.Text>
                                <Card.Text className="text-truncate">
                                    <strong>Description:</strong> {job.description}
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button
                                        variant="info"
                                        className="w-100 mb-2"
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setShowModal(true);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="warning"
                                        className="w-100 mb-2"
                                        onClick={() => handleEdit(job)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="w-100"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* View Details Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{selectedJob?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Description:</strong> {selectedJob?.description}
                    </p>
                    <p>
                        <strong>Salary:</strong> {selectedJob?.salary}
                    </p>
                    <p>
                        <strong>Requirements:</strong> {selectedJob?.requirements}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PostJob;

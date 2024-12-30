import React , {useEffect} from 'react';
import { Table, Container} from 'react-bootstrap';
import { Typography } from '@mui/material';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
const JobApplications = () => {
    const navigate = useNavigate();
    const {currentUser}=useAuth();
    useEffect(() => {
        if (!currentUser) {
          navigate("/login");
        }
      });

    const applications = [
        { id: 1, applicant: 'John Doe', job: 'Software Engineer', status: 'Pending' },
        { id: 2, applicant: 'Jane Smith', job: 'Product Manager', status: 'Accepted' },
    ];

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5 pt-50"  style={{ paddingTop: '250px' }}>
            <div className="w-100">
                <Typography variant="h4" className="mb-4 text-center">
                    Job Applications
                </Typography>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Job Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.applicant}</td>
                                <td>{app.job}</td>
                                <td>{app.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default JobApplications;

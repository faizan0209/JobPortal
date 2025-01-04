import React, { useEffect, useState } from "react";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { Typography } from "@mui/material";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, addDoc, doc } from "./Firebase";
import { db } from "./Firebase"; // Replace with your actual Firebase config

const JobApplications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [clickedButtons, setClickedButtons] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      fetchApplications();
    }
  }, [currentUser]);

  const fetchApplications = async () => {
    try {
      const applicationsRef = collection(db, "applications");
      const snapshot = await getDocs(applicationsRef);
      const fetchedApplications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const buttonState = fetchedApplications.reduce((acc, app) => {
        if (app.status === "Accepted" || app.status === "Rejected") {
          acc[app.id] = true;
        }
        return acc;
      }, {});
      setApplications(fetchedApplications);
      setClickedButtons(buttonState);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  const handleShowModal = (application, status) => {
    setSelectedApplication({ ...application, status });
    setShowModal(true);
    setValidationError(""); // Clear previous validation errors
  };

  const handleApplicationStatus = async () => {
    if (!selectedApplication) return;

    if (message.trim() === "") {
      setValidationError("Message cannot be empty!");
      return;
    }

    const { id, status } = selectedApplication;
    try {
      const applicationRef = doc(db, "applications", id);
      await updateDoc(applicationRef, { status, message });

      // Save notification for the user
      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        userId: selectedApplication.userId,
        message: `Your application for ${selectedApplication.jobTitle} has been ${status}. ${
          message ? `Message: ${message}` : ""
        }`,
        status,
        timestamp: new Date(),
      });

      setClickedButtons((prev) => ({ ...prev, [id]: true })); // Disable buttons
      fetchApplications(); // Refresh applications list
    } catch (error) {
      console.error(`Error updating application status:`, error);
      alert("Failed to update application status. Please try again.");
    } finally {
      setShowModal(false);
      setMessage("");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <div className="w-100">
        <Typography variant="h4" className="mb-4 text-center">
          Job Applications
        </Typography>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Job Title</th>
              <th>Email</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.userName}</td>
                <td>{app.jobTitle}</td>
                <td>{app.userEmail}</td>
                <td>
                  <Button
                    variant="link"
                    onClick={() => handleDownloadResume(app.resumeUrl)}
                  >
                    Download Resume
                  </Button>
                </td>
                <td>{app.status || "Pending"}</td>
                <td>
                  <Button
                    variant="success"
                    className={`me-2 ${clickedButtons[app.id] ? "disabled-btn" : ""}`}
                    onClick={() => handleShowModal(app, "Accepted")}
                    disabled={clickedButtons[app.id]} // Disable if clicked
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    className={`${clickedButtons[app.id] ? "disabled-btn" : ""}`}
                    onClick={() => handleShowModal(app, "Rejected")}
                    disabled={clickedButtons[app.id]} // Disable if clicked
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Accept/Reject */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedApplication?.status === "Accepted"
              ? "Send Interview Details"
              : "Reject Application"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                {selectedApplication?.status === "Accepted"
                  ? "Message to Applicant"
                  : "Rejection Message"}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={
                  selectedApplication?.status === "Accepted"
                    ? "Enter interview details..."
                    : "Enter rejection reason..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {validationError && (
                <Form.Text className="text-danger">{validationError}</Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={selectedApplication?.status === "Accepted" ? "success" : "danger"}
            onClick={handleApplicationStatus}
          >
            {selectedApplication?.status === "Accepted" ? "Send Details" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default JobApplications;

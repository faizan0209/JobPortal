import React, { useEffect, useState } from "react";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import { Typography } from "@mui/material";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, addDoc, doc } from "./Firebase";
import { db } from "./Firebase"; // Replace with your actual Firebase config
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobApplications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [clickedButtons, setClickedButtons] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [interviewVenue, setInterviewVenue] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false); // To control loader

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
    setMessage(""); // Clear previous messages
    setInterviewVenue(""); // Clear interview venue
    setInterviewDate(""); // Clear interview date
  };

  const handleApplicationStatus = async () => {
    if (!selectedApplication) return;

    if (message.trim() === "") {
      setValidationError("Message cannot be empty!");
      return;
    }

    if (
      selectedApplication.status === "Accepted" &&
      (interviewVenue.trim() === "" || interviewDate.trim() === "")
    ) {
      setValidationError("Both interview venue and date are required!");
      return;
    }

    const { id, status } = selectedApplication;

    setLoading(true); // Start the loader

    try {
      const applicationRef = doc(db, "applications", id);
      const updateData = {
        status,
        message,
        ...(status === "Accepted" && {
          interviewDetails: { venue: interviewVenue, date: interviewDate },
        }),
      };
      await updateDoc(applicationRef, updateData);

      // Save notification for the user
      const notificationRef = collection(db, "notifications");
      await addDoc(notificationRef, {
        userId: selectedApplication.userId,
        message: `Your application for ${selectedApplication.jobTitle} has been ${status}. ${
          message ? `Message: ${message}` : ""
        }`,
        status,
        ...(status === "Accepted" && {
          interviewDetails: { venue: interviewVenue, date: interviewDate },
        }),
        timestamp: new Date(),
      });

      setClickedButtons((prev) => ({ ...prev, [id]: true })); // Disable buttons
      fetchApplications(); // Refresh applications list

      // Show success toast
      toast.success(`Application ${status} successfully!`);
    } catch (error) {
      console.error(`Error updating application status:`, error);
      toast.error("Failed to update application status. Please try again.");
    } finally {
      setLoading(false); // Stop the loader
      setShowModal(false);
      setMessage("");
      setInterviewVenue("");
      setInterviewDate("");
    }
  };

  return (
    <Container className="mt-5" style={{ height: "100vh", width: "100%" }}>
      <div className="w-100">
        <Typography variant="h4" className="mb-4 text-center" style={{ padding: "60px", fontWeight: "bold" }}>
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
                  <Button variant="link" onClick={() => handleDownloadResume(app.resumeUrl)}>
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
            {selectedApplication?.status === "Accepted" ? "Send Interview Details" : "Reject Application"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                {selectedApplication?.status === "Accepted" ? "Message to Applicant" : "Rejection Message"}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={selectedApplication?.status === "Accepted" ? "Enter interview details..." : "Enter rejection reason..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>

            {selectedApplication?.status === "Accepted" && (
              <>
                <Form.Group className="mt-3">
                  <Form.Label>Interview Venue</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter interview venue"
                    value={interviewVenue}
                    onChange={(e) => setInterviewVenue(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Interview Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {validationError && <Form.Text className="text-danger">{validationError}</Form.Text>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant={selectedApplication?.status === "Accepted" ? "success" : "danger"} onClick={handleApplicationStatus}>
            {loading ? "Loading..." : selectedApplication?.status === "Accepted" ? "Send Details" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </Container>
  );
};

export default JobApplications;

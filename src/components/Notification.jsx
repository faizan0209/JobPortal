import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { collection, query, where, getDocs } from "./Firebase";
import { db } from "./Firebase"; // Replace with your Firebase config
import { useAuth } from "../context/authContext";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("User not logged in or currentUser is undefined.");
      return;
    }
  
    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  return (
    <Container className="mt-5 py-5 ">
     <h1 className="fw-bold  text-dark mb-4 py-4" style={{ fontSize: "2rem" }}>
    Notification
  </h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Message</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{notification.message}</td>
              <td>{notification.status}</td>
              <td>{new Date(notification.timestamp.toDate()).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Notifications;

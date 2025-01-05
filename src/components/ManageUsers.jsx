import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState(null); // Track the user being deleted
  const db = getFirestore();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [db]);

  // Delete user from Firestore
  const handleDelete = async (id) => {
    setDeletingUser(id); // Set the user being deleted
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id)); // Update UI after deletion
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Failed to delete user.");
    } finally {
      setDeletingUser(null); // Reset the deleting state
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh", // Full viewport height for vertical centering
          width: "100%",   // Full width
          padding: "0",    // Remove padding for proper centering
        }}
      >
        <Typography variant="h4" className="mb-4 text-center"style={{ fontWeight: "bold" }}>
          Manage Users
        </Typography>
        <TableContainer component={Paper}>
          <Table striped bordered hover>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.displayName || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUser === user.id} // Disable button when deleting this user
                    >
                      {deletingUser === user.id ? <CircularProgress size={24} /> : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default ManageUsers;

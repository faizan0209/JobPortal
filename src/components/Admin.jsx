import React,  {useEffect} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './Admin.css';  // Add this file for custom styles
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
const Admin = () => {
const navigate = useNavigate();
const {currentUser}=useAuth();
useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  });

  return (
    <div className="admin-page">

      {/* Content */}
      <div className="container-fluid main-content flex justify-center items-center flex-col">
        {/* Welcome Section */}
        <div className="text-center text-white pt-50 ">
          <h2 className="display-4 welcome-title">Welcome to the Admin Dashboard</h2>
          <p className="lead welcome-paragraph">Select an option from the menu to get started.</p>
        </div>

        {/* Card Section */}
        <div className="row justify-content-center align-items-center mt-5 h-[42%]">
          <div className="col-md-3 mb-4 h-100">
            <div className="card card-size">
              <div className="card-body">
                <h5 className="card-title">Post Job</h5>
                <p className="card-text">Post a new job to the portal.</p>
                <Link to="/post-job" className="btn btn-primary">Go to Post Job</Link>
              </div>
            </div>
          </div> 
          <div className="col-md-3 mb-4 h-100">
            <div className="card card-size">
              <div className="card-body">
                <h5 className="card-title">Manage Users</h5>
                <p className="card-text">View and manage users on the portal.</p>
                <Link to="/manage-users" className="btn btn-secondary">Manage Users</Link>
              </div>
            </div>
          </div> 
          <div className="col-md-3 mb-4 h-100">
            <div className="card card-size">
              <div className="card-body">
                <h5 className="card-title">View Applications</h5>
                <p className="card-text">View the job applications submitted by users.</p>
                <Link to="/applications" className="btn btn-warning">View Applications</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

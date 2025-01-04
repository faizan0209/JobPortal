import React, { useEffect, useState } from "react";
import { db, auth, storage, doc, getDoc } from "./Firebase"; // Import Firestore, Auth, and Firebase Storage
import { collection, getDocs, addDoc } from "./Firebase";
import { ref, uploadBytes, getDownloadURL } from "./Firebase";
import { onAuthStateChanged } from "./Firebase";
import "./UserPage.css"; // Add your CSS file for styling
import { FaUserCircle } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { IoMdMailUnread } from "react-icons/io";

import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function UserPage() {
  const [user, setUser] = useState(null); // Logged-in user details
  const [jobs, setJobs] = useState([]); // Job listings
  const [selectedJob, setSelectedJob] = useState(null); // Selected job for applying
  const [showForm, setShowForm] = useState(false); // Form visibility
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: null,
  });

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  console.log(currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  });

  useEffect(() => {
    // Fetch job data from Firestore
    const fetchJobs = async () => {
      const jobSnapshot = await getDocs(collection(db, "jobs"));
      const jobList = jobSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    };

    fetchJobs();
  }, []);

  // Fetch user data from Firestore
  const fetchUser = async (userId) => {
    if (currentUser) {
      try {
        console.log({ db, userId: userId });

        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setData(userDoc.data());
          return;
        } else {
          console.log("No such document!");
          return null;
        }
      } catch (error) {
        console.log("there is error in... ", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUser(currentUser.uid);
    } else {
      console.log("no idea");
    }
  }, [currentUser]);

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResumeUpload = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.resume) {
      alert("All fields are required.");
      return;
    }

    // setLoading(true); // Show loader
    try {
      // Replace with your actual Cloudinary details
      const cloudinaryUrl =
        "https://api.cloudinary.com/v1_1/dmcmwflh7/image/upload"; // Cloudinary API endpoint
      const uploadPreset = "AppsImage"; // Cloudinary upload preset

      // Prepare form data for Cloudinary
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", formData.resume); // File upload
      formDataToUpload.append("upload_preset", uploadPreset); // Upload preset
      formDataToUpload.append(
        "context",
        `name=${formData.name}|email=${formData.email}`
      ); // Metadata

      // Upload file to Cloudinary
      const cloudinaryResponse = await axios.post(
        cloudinaryUrl,
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const resumeUrl = cloudinaryResponse.data.secure_url; // Get uploaded file URL

      // Save application data to Firestore
      const applicationData = {
        userId: currentUser.uid,
        userName: formData.name,
        userEmail: formData.email,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        resumeUrl: resumeUrl,
        appliedAt: new Date(),
      };

      await addDoc(collection(db, "applications"), applicationData);
      alert("Application submitted successfully!");
      setShowForm(false);
      setFormData({ name: "", email: "", resume: null });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      // setLoading(false); // Hide loader
    }
  };

  return (
    <div className="user-page">
      <div className="user-profile-container">
        <div className="user-profile">
          <div className="profile-icon">
            <FaUserCircle className="profile-icon" />
            {/* FontAwesome Icon */}
          </div>
          <h2>{data.displayName || "unknown"}</h2>
          <p>email: {data.email || "unknown"}</p>
          {console.log(data)}
          <br />
          <div className="notification flex gap-3">
            {/* <Link to="/notification" className="bg-gray-200 p-3 block rounded">
              {false ? (
                <IoMail className="text-3xl" />
              ) : (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  class="text-3xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="432" cy="128" r="64" fill="red"></circle>
                  <path d="M382.9 203.4L256 288 80 170.7V128l176 117.3 101.1-67.4c-9.5-14.3-15.1-31.5-15.1-49.9 0-17.6 5.1-34.1 13.9-48H74.7C51.2 80 32 99.2 32 122.7v266.7c0 23.5 19.2 42.7 42.7 42.7h362.7c23.5 0 42.7-19.2 42.7-42.7V204.1c-13.9 8.8-30.4 13.9-48 13.9-18.2 0-35.1-5.4-49.2-14.6z"></path>
                </svg>
              )}
            </Link> */}
            <Link to="/history" className="bg-gray-200 p-3 block rounded">
              {false ? (
                <IoMail className="text-3xl" />
              ) : (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  class="text-3xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 8v4.414l3.707 3.707-1.414 1.414L10 13.414V8h2zm0-7a10 10 0 11-9.477 13.197l1.736-.992A8 8 0 1012 4V1z"></path>
                </svg>
              )}
            </Link>
            <Link to="/notification" className="bg-gray-200 p-3 block rounded">
              {false ? (
                <IoMail className="text-3xl" />
              ) : (
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  class="text-3xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="432" cy="128" r="64" fill="red"></circle>
                  <path d="M382.9 203.4L256 288 80 170.7V128l176 117.3 101.1-67.4c-9.5-14.3-15.1-31.5-15.1-49.9 0-17.6 5.1-34.1 13.9-48H74.7C51.2 80 32 99.2 32 122.7v266.7c0 23.5 19.2 42.7 42.7 42.7h362.7c23.5 0 42.7-19.2 42.7-42.7V204.1c-13.9 8.8-30.4 13.9-48 13.9-18.2 0-35.1-5.4-49.2-14.6z"></path>
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold my-3">Available Jobs</h1>
      <div className="job-cards pb-20">
        {jobs.map((job) => (
          <div className="job-card flex flex-col justify-between" key={job.id}>
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <br />
              <p>
                <strong>Requirements: </strong>
                {job.requirements}
              </p>
              <p>
                <strong>Salary: </strong>
                {job.salary}
              </p>
            </div>
            <button className={"self-end"} onClick={() => handleApply(job)}>
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Job Application Form Popup */}
      {showForm && (
        <div className="form-popup">
          <div className="form-container">
            <h2>Apply for {selectedJob.title}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="file"
                name="resume"
                accept=".pdf, .doc, .docx"
                onChange={handleResumeUpload}
                placeholder="Upload Your Resume"
              />
              <small className="block mb-6">Upload your Resume</small>

              <button type="submit" onClick={handleSubmit}>
                Submit Application
              </button>
            </form>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;

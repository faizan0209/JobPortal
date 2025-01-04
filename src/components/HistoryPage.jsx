import React, { useEffect, useState } from "react";
import { db } from "./Firebase"; // Firestore import
import { collection, query, where, getDocs } from "./Firebase";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import "./history.css"

function HistoryPage() {
  const [applications, setApplications] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      alert("You must be logged in to view your application history.");
      return;
    }

    // Fetch user's application history
    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, "applications");
        const q = query(applicationsRef, where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const fetchedApplications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(fetchedApplications);
      } catch (error) {
        console.error("Error fetching application history:", error);
      }
    };

    fetchApplications();
  }, [currentUser]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 d-flex justify-content-center flex-column ">
      <h1 className="text-3xl font-semibold text-center mb-6 py-5">Application History</h1>
      {applications.length === 0 ? (
        <p className="text-center text-gray-600">
          No applications found. <Link to="/" className="text-blue-500">Apply for jobs</Link>
        </p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <table className="min-w-[800px] max-w-full mx-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Job Title</th>
                <th className="py-2 px-4 border">Resume</th>
                <th className="py-2 px-4 border">Date Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{application.jobTitle}</td>
                  <td className="py-2 px-4 border">
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Resume
                    </a>
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(application.appliedAt.seconds * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;

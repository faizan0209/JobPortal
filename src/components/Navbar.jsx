import React, { useState, useEffect } from "react";
import { FaBriefcase } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./Firebase";  // Assuming Firebase is correctly initialized

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is an admin

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Check if the user has an admin role in Firestore
        const userDocRef = doc(db, "users", user.uid); // Access the user's document by UID
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false); // Reset admin state when no user is logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false); // Reset the admin state when the user logs out
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="fixed w-full bg-white shadow-md z-50 top-0">
      <div className="flex justify-between items-center p-4 md:px-32 px-5">
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <FaBriefcase size={40} className="text-blue-600" />
          <h1 className="ml-2 text-xl font-semibold">Job Portal</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex justify-center items-center text-lg font-medium gap-8 flex-grow">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-400 transition-all cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/about"
            className=" text-blue-600  hover:text-blue-400  transition-all cursor-pointer"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="   text-blue-600  hover:text-blue-400  transition-all cursor-pointer"
          >
            Contact
          </Link>
        </nav>

        {/* Login / Logout Button */}
        <div>
          {user ? (
            <button
              onClick={handleLogoutClick}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
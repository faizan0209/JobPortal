import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/Firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Start with null
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for auth initialization

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false); // Auth state is resolved
    });

    return () => unsubscribe();
  }, []); // Run only once on component mount

  if (loading) {
    // Optionally show a loader or return null while auth state resolves
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        details,
        setDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

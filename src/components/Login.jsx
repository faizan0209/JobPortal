import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './Firebase';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';


function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const {currentUser} = useAuth();
  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")

  console.log(currentUser);
  

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // For regular users, proceed with Firebase authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setTimeout(() => {
        navigate("/userpage");
      }, 2000);
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    }
    if (email === "faizan123@gmail.com" && password === "FA12345") {
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
      return; // Exit the function to prevent Firebase authentication attempt
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  return (
    <>
      <div>
        <div className="bg-white dark:bg-gray-900">
          <div className="flex justify-center h-screen">
            <div className="hidden bg-cover lg:block lg:w-2/3">
              <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40  bk-img ">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">Welcome Back</h2>
                  <p className="max-w-xl mt-3 text-gray-100">
                    Ready to continue your journey? Log in to access your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1 flex-col items-center w-full">
                {/* <MdRestaurant className="text-orange-500 text-4xl mb-4" /> */}
                <div className="text-center">
                  <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to your account</p>
                </div>

                <div className="mt-8">
                  <form onSubmit={handleLogin}>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                      <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@example.com"
                        className="block w-full px-4 py-2 mt-2 text-gray-Z00 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-600 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                        <a href="#" className="text-sm text-gray-400 focus:text-orange-500 hover:text-orange-500 hover:underline">Forgot password?</a>
                      </div>

                      <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Your Password"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-700 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>


                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-700 rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        Sign in
                      </button>
                    </div>

                  </form>

                  <div className="mt-6 text-sm text-center text-gray-400">
                    Don&#x27;t have an account yet?{" "}
                    <button
                      onClick={() => navigate("/signup")}
                      className="text-blue-500 focus:outline-none focus:underline hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

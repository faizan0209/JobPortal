import React from "react";
import { Link } from "react-router-dom";
import Person1 from "../assets/img/person1.jpg";
import Person2 from "../assets/img/person2.jpg";
import Person3 from "../assets/img/person3.jpg";
const About = () => {
  return (
    <div className="bg-gray-50 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          We are a dedicated team that strives to connect talented professionals
          with exciting job opportunities. Our platform makes the job search
          process seamless, efficient, and user-friendly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
            <img
              src={Person1}
              alt="Team Member"
              className="rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
            <p className="text-center text-gray-500 mt-2">
              To provide a reliable, transparent, and efficient job portal for
              both employers and job seekers.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
            <img
              src={Person2}
              alt="Team Member"
              className="rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Values</h3>
            <p className="text-center text-gray-500 mt-2">
              We believe in integrity, innovation, and inclusivity, ensuring
              everyone gets equal opportunities.
            </p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
            <img
              src={Person3}
              alt="Team Member"
              className="rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
            <p className="text-center text-gray-500 mt-2">
              To become the leading platform for career advancement and job
              matching in the digital age.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-blue-600 text-white py-8">
          <h2 className="text-3xl font-bold">Join Us Today</h2>
          <p className="text-lg mt-4">
            Be part of our community and take the next step in your career.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-md hover:bg-gray-200 transition"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

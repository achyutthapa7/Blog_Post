"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../lib/store";
import { checkAuthStatus, logoutUser } from "../lib/features/user/userSlice";
import Loader from "./Loader";
import { logout } from "../utils/requests";

const Landing = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading === "idle" || loading === "pending") {
    return <Loader />;
  } else if (loading === "failed") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600">
            Authentication Error
          </h2>
          <p className="text-gray-600">
            An error occurred while checking authentication status.
          </p>
        </div>
      </div>
    );
  }

  const uniqueId = uuidv4();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setIsLoggingOut(true);
      const res = await logout();
      if (res?.status === 200) {
        dispatch(logoutUser());
      } else {
        console.error("Error while logging out:", res);
      }
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BlogSphere</h1>
        <div className="space-x-6">
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? <Loader /> : "Logout"}
            </button>
          ) : (
            <Link
              href={`login/${uniqueId}/?redirect=${encodeURIComponent(
                "/home"
              )}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
       
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
          Welcome to <span className="text-blue-600">BlogSphere</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl">
          Share your thoughts, connect with like-minded people, and explore
          amazing content from around the world in a seamless, beautifully
          crafted experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {!isAuthenticated ? (
            <Link
              href={`login/${uniqueId}/?redirect=${encodeURIComponent(
                "/home"
              )}`}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-medium transition w-full sm:w-auto">
                Login
              </button>
            </Link>
          ) : (
            <Link href="/home">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-medium transition w-full sm:w-auto">
                Start Writing
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;

"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../lib/store";
import { checkAuthStatus } from "../lib/features/user/userSlice";
import Loader from "./Loader";

const Landing = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to BlogSphere
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Share your thoughts, connect with like-minded people, and explore
        amazing content from around the world.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {!isAuthenticated ? (
          <Link
            href={`login/${uniqueId}/?redirect=${encodeURIComponent("/home")}`}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md w-full sm:w-auto">
              Login
            </button>
          </Link>
        ) : (
          <Link href="/home">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md w-full sm:w-auto">
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Landing;

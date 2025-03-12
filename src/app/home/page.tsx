"use client";

import ShowBlogs from "../components/ShowBlogs";
import ProtectedRoute from "../ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <div className=" w-full">
        <ShowBlogs />
      </div>
    </ProtectedRoute>
  );
};

export default page;

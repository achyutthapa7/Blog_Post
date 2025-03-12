"use client";

import ShowBlogs from "../components/ShowBlogs";
import TextEditor from "../components/TextEditor";
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

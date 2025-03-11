"use client";

import ProtectedRoute from "../ProtectedRoute";

const page = () => {
  return <ProtectedRoute>home</ProtectedRoute>;
};

export default page;

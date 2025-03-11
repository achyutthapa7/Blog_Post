import React from "react";
import LoginForm from "../../components/Login";
import ProtectedRoute from "../../ProtectedRoute";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <ProtectedRoute>
      <LoginForm />
    </ProtectedRoute>
  );
};

export default page;

import React from "react";
import LoginForm from "../../components/Login";
import ProtectedRoute from "../../ProtectedRoute";

const page = ({ params }: { params: { id: string } }) => {
  console.log(params);
  return (
    <ProtectedRoute>
      <LoginForm />
    </ProtectedRoute>
  );
};

export default page;

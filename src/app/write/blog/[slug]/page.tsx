import TextEditor from "@/app/components/TextEditor";
import ProtectedRoute from "@/app/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <TextEditor />
    </ProtectedRoute>
  );
};

export default page;

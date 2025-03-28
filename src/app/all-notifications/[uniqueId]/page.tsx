import ShowAllNotifications from "@/app/components/ShowAllNotifications";
import ProtectedRoute from "@/app/ProtectedRoute";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute>
      <ShowAllNotifications />
    </ProtectedRoute>
  );
};

export default page;

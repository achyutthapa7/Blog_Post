"use client";
import ProtectedRoute from "@/app/ProtectedRoute";
import { getUserById } from "@/app/utils/requests";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const serachParams = useSearchParams();
  const userId = serachParams.get("userId");
  if (!userId) return <ProtectedRoute>Invalid User ID</ProtectedRoute>;
  useEffect(() => {
    const getUserProfile = async () => {
      const res = await getUserById(userId);
      console.log(res);
    };
    getUserProfile();
  }, [userId]);
  return <ProtectedRoute>{userId}</ProtectedRoute>;
};

export default page;

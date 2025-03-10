"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { useRouter } from "next/navigation";

const page = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }
  return <div>home</div>;
};

export default page;

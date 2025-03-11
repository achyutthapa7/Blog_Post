"use client";
import React, { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./lib/store";
import { checkAuthStatus } from "./lib/features/user/userSlice";
import { redirect, usePathname } from "next/navigation";
import Loader from "./components/Loader";
import { v4 as uuidv4 } from "uuid";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );
  const pathname = usePathname();
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
  if (isAuthenticated && pathname.startsWith("/login")) {
    redirect("/home");
  }

  if (!isAuthenticated && !pathname.startsWith("/login")) {
    const uniqueId = uuidv4();
    sessionStorage.setItem("loginId", uniqueId);
    const redirectUrl = `/login/${uniqueId}?redirect=${encodeURIComponent(
      pathname
    )}`;
    redirect(redirectUrl);
  }
  if (!isAuthenticated && pathname.startsWith("/login")) {
    const storedLoginId = sessionStorage.getItem("loginId");
    const currentLoginId = pathname.split("/")[2];
    if (storedLoginId !== currentLoginId) {
      redirect("/home");
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;

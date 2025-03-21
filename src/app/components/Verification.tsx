"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { verification } from "../utils/requests";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "./Login";

const Verification = () => {
  const uniqueId = uuidv4();
  const [isLoading, setIsLoading] = useState(false);

  const { user, isVerified } = useSelector((state: RootState) => state?.user);
  console.log("user", user);
  const [code, setCode] = useState("");
  const searchParam = useSearchParams();
  const emailAddress = searchParam.get("emailAddress") || "your email address";
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
    if (user && isVerified) {
      router.push("/login");
    }
  }, [user, isVerified]);

  const handleVerification = async () => {
    if (!code) {
      toast.error("Please enter the verification code");
      return;
    }
    setIsLoading(true);
    try {
      const res = await verification(emailAddress, Number(code));
      if (res?.status === 200) {
        toast.success("Email verification successfull!");
        router.push(`/login/${uniqueId}/?redirect=home`);
        console.log("Verification successful");
      } else {
        toast.error(
          "Invalid verification code or code is expired, please try again"
        );
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-gray-600 text-center mt-2">
          A verification code has been sent to <br />
          <span className="font-semibold text-blue-500">{emailAddress}</span>.
          Please enter the code below.
        </p>

        {/* Input Field */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          className="mt-5 w-full p-3 border rounded-lg text-lg text-center tracking-wider shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Verify Button */}
        <button
          onClick={handleVerification}
          disabled={isLoading}
          className="mt-4 w-full p-3 rounded-lg bg-blue-500 text-white font-medium text-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <Loader />
            </>
          ) : (
            "Verify"
          )}
        </button>

        {/* Resend Code */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Didn't receive the code?{" "}
          <button className="text-blue-500 font-medium hover:underline transition">
            Resend Code
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Verification;

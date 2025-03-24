"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/app/ProtectedRoute";
import { getUserById } from "@/app/utils/requests";
import {
  UserCircleIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  _id: string;
  userId: {
    firstName: string;
  };
  commentText: string;
  author: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  blogs: Blog[];
}

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBlogs, setExpandedBlogs] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (!userId) return;
    const fetchUserProfile = async () => {
      try {
        const res = await getUserById(userId);
        setUser(res);
      } catch (err) {
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const toggleBlogExpansion = (blogId: string) => {
    setExpandedBlogs((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userId) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Invalid User
            </h2>
            <p className="text-gray-600">The user ID provided is not valid.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Profile */}
          {user && (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-gray-600 mt-1">{user.email}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.blogs.length}{" "}
                          {user.blogs.length === 1 ? "Blog" : "Blogs"}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active User
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blogs Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Blogs
                </h2>

                {user.blogs.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No blogs yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      This user hasn't published any blogs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.blogs.map((blog) => (
                      <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {blog.title}
                              </h3>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                <span>{formatDate(blog.createdAt)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleBlogExpansion(blog._id)}
                              className="p-1 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                            >
                              {expandedBlogs[blog._id] ? (
                                <ChevronUpIcon className="h-5 w-5" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>

                          <p
                            className={`mt-3 text-gray-600 ${
                              !expandedBlogs[blog._id] ? "line-clamp-3" : ""
                            }`}
                          >
                            {blog.content}
                          </p>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="inline-flex items-center text-sm text-gray-500">
                                <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                                {blog.likes.length} likes
                              </span>
                              <span className="inline-flex items-center text-sm text-gray-500">
                                <ChatBubbleLeftIcon className="h-4 w-4 mr-1 text-blue-500" />
                                {blog.comments.length} comments
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                router.push(`/blogs/?blogId=${blog._id}`)
                              }
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              Read full post
                              <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comments Section - Only visible when expanded */}
                        <AnimatePresence>
                          {expandedBlogs[blog._id] &&
                            blog.comments.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-gray-100 bg-gray-50"
                              >
                                <div className="p-6">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Comments
                                  </h4>
                                  <div className="space-y-4">
                                    {blog.comments.map((comment) => (
                                      <div key={comment._id} className="flex">
                                        <div className="flex-shrink-0 mr-3">
                                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <UserCircleIcon className="h-5 w-5" />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-gray-800">
                                            {comment.commentText}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            by{" "}
                                            {comment?.userId?.firstName ||
                                              "Anonymous"}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

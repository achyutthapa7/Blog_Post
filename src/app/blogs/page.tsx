"use client";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getBlogById } from "../utils/requests";
import Link from "next/link";

const Page = () => {
  interface Blog {
    _id: string;
    title: string;
    content: string;
    createdAt?: string;
    likes: string[];
  }
  const searchParams = useSearchParams();
  const blogId = searchParams?.get("blogId");
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blogId) return; // Prevent API call if no blogId

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(blogId);
        setBlog(res);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        {/* Back Arrow */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black text-lg"
          >
            ← Back
          </button>
          <Link href="/home" className="text-blue-600 hover:underline">
            Go to Home
          </Link>
        </div>

        {/* Blog Content */}
        <h1 className="text-3xl font-bold mb-2">{blog?.title}</h1>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(blog?.createdAt || Date.now()).toLocaleDateString()}{" "}
          {blog?.likes?.length} Likes
        </p>
        <p className="text-lg leading-relaxed">{blog?.content}</p>
      </div>
    </ProtectedRoute>
  );
};

export default Page;

// "use client";

// import Link from "next/link";
// import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import React, { useState } from "react";
// import { handleAddBlog } from "../utils/requests";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../lib/store";
// import { addBlog } from "../lib/features/blog/blogSlice";
// import { redirect } from "next/navigation";
// import { toast } from "react-toastify";
// import { Loader } from "./Login";

// const TextEditor = () => {
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const dispatch = useDispatch<AppDispatch>();
//   const handlePublish = async () => {
//     setLoading(true);
//     setLoading(false);

//     dispatch(addBlog({ title, content }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
//       {/* Go Back Button */}
//       <Link
//         href="/home"
//         className="flex items-center text-gray-600 hover:text-black mb-4"
//       >
//         <ArrowLeftIcon className="w-5 h-5 mr-2" />
//         Go Back
//       </Link>

//       {/* Title */}
//       <h2 className="text-2xl font-semibold mb-4">Create a Blog</h2>

//       {/* Blog Title Input */}
//       <input
//         type="text"
//         className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//         placeholder="Enter Blog Title..."
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       {/* Blog Content Editor */}
//       <textarea
//         className="w-full h-60 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="Write your blog content here..."
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />

//       {/* Publish Button */}
//       <button
//         disabled={loading}
//         onClick={handlePublish}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//       >
//         {loading ? <Loader /> : "Publish"}
//       </button>
//     </div>
//   );
// };

// export default TextEditor;
"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/store";
import { addBlog } from "../lib/features/blog/blogSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader } from "./Login";

const TextEditor = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(addBlog({ title, content })).unwrap();

      if (response) {
        toast.success("Blog added successfully");
        router.push("/home"); // Redirect after success
      } else {
        toast.error("Failed to add blog.");
      }
    } catch (error) {
      console.error("Error while adding blog:", error);
      toast.error("An error occurred while adding the blog.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Go Back Button */}
      <Link
        href="/home"
        className="flex items-center text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Go Back
      </Link>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4">Create a Blog</h2>

      {/* Blog Title Input */}
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Enter Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Blog Content Editor */}
      <textarea
        className="w-full h-60 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your blog content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Publish Button */}
      <button
        disabled={loading}
        onClick={handlePublish}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? <Loader /> : "Publish"}
      </button>
    </div>
  );
};

export default TextEditor;

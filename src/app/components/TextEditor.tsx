// "use client";

// import Link from "next/link";
// import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../lib/store";
// import { addBlog } from "../lib/features/blog/blogSlice";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { Loader } from "./Login";
// import { io } from "socket.io-client";

// const SOCKET_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.NEXT_PUBLIC_SOCKET_URL_PRODUCTION
//     : process.env.NEXT_PUBLIC_SOCKET_URL_DEVELOPMENT;

// const socket = io(SOCKET_URL, {
//   autoConnect: false,
// });
// const TextEditor = () => {
//   useEffect(() => {
//     socket.connect();
//   }, []);
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const handlePublish = async () => {
//     if (!title.trim() || !content.trim()) {
//       toast.error("Title and content cannot be empty!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await dispatch(addBlog({ title, content })).unwrap();
//       if (response) {
//         toast.success("Blog added successfully");
//         console.log({ response });
//         socket.emit("new-blog", response);
//         router.push("/home");
//       } else {
//         toast.error("Failed to add blog.");
//       }
//     } catch (error) {
//       console.error("Error while adding blog:", error);
//       toast.error("An error occurred while adding the blog.");
//     }

//     setLoading(false);
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
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/store";
import { addBlog } from "../lib/features/blog/blogSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader } from "./Login";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SOCKET_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_SOCKET_URL_DEVELOPMENT;

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Font options
const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];
const FONT_FAMILIES = [
  { name: "Sans-serif", value: "sans-serif" },
  { name: "Serif", value: "serif" },
  { name: "Monospace", value: "monospace" },
];
const FONT_WEIGHTS = ["normal", "medium", "bold"];

const TextEditor = () => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontWeight, setFontWeight] = useState("normal");
  const [isExpanded, setIsExpanded] = useState(false);
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
        socket.emit("new-blog", response);
        router.push("/home");
      } else {
        toast.error("Failed to add blog.");
      }
    } catch (error) {
      console.error("Error while adding blog:", error);
      toast.error("An error occurred while adding the blog.");
    }
    setLoading(false);
  };

  const textEditorStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    lineHeight: "1.6",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10"
    >
      {/* Header with back button and title */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/home"
          className="flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <motion.div whileHover={{ x: -2 }}>
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
          </motion.div>
          Go Back
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">Create a Blog</h2>
        <div className="w-5 h-5"></div> {/* Spacer for alignment */}
      </div>

      {/* Blog Title Input */}
      <motion.input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-lg font-medium"
        placeholder="Enter Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
      />

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <label htmlFor="font-size" className="mr-2 text-sm text-gray-600">
            Size:
          </label>
          <select
            id="font-size"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="font-family" className="mr-2 text-sm text-gray-600">
            Font:
          </label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="font-weight" className="mr-2 text-sm text-gray-600">
            Weight:
          </label>
          <select
            id="font-weight"
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
            className="border rounded p-1 text-sm"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {isExpanded ? "Compact View" : "Expand View"}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="ml-1"
          >
            ▼
          </motion.span>
        </button>
      </div>

      {/* Blog Content Editor */}
      <motion.textarea
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Write your blog content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={textEditorStyle}
        animate={{
          height: isExpanded ? "500px" : "300px",
        }}
        transition={{ type: "spring", stiffness: 100 }}
        whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
      />

      {/* Character count */}
      <div className="text-right text-sm text-gray-500 mt-1">
        {content.length} characters
      </div>

      {/* Publish Button */}
      <motion.div className="flex justify-end mt-6">
        <motion.button
          disabled={loading}
          onClick={handlePublish}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <span>Publish</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TextEditor;

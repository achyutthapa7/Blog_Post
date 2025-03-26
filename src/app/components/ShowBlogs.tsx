"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlog,
  addComment,
  blogLike,
  blogUnlike,
  deleteComment,
  fetchBlog,
  likeBlog,
  removeComment,
  setBlogs,
  setComments,
  unLikeBlog,
} from "../lib/features/blog/blogSlice";
import { AppDispatch, RootState } from "../lib/store";
import Loader from "./Loader";
import { IBlog } from "../db/models/blog.model";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolid } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  INotification,
  setNotifications,
} from "../lib/features/notifcation/notificationSlice";

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SOCKET_URL_PRODUCTION
    : process.env.NEXT_PUBLIC_SOCKET_URL_DEVELOPMENT;

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

const ShowBlogs = () => {
  const { blogs, totalBlogs, loading, limit } = useSelector(
    (state: RootState) => state.blog
  );
  const [page, setPage] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBlog(page));
  }, [dispatch, page]);

  useEffect(() => {
    socket.connect();
    socket.on("new-blog", (blog) => {
      dispatch(setBlogs(blog));
    });
    return () => {
      socket.off("connect");
    };
  }, [dispatch]);

  if (loading === "idle" && blogs.length === 0) {
    return <Loader />;
  }

  const handleLoadMore = () => {
    if (page * limit < totalBlogs) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {blogs?.length > 0 ? (
          <>
            {blogs?.map((blog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <BlogPost blog={blog} />
              </motion.div>
            ))}

            <div className="flex justify-center mt-8">
              {page * limit < totalBlogs ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loading === "pending"}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                >
                  {loading === "pending" ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Load More
                      <ArrowDownIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 font-medium">
                    You've reached the end of the feed
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Check back later for new content
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No blogs available
            </h3>
            <p className="text-gray-500 max-w-md">
              It looks like there are no blogs to display. Be the first to
              create one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBlogs;

const BlogPost = ({ blog }: { blog: IBlog }) => {
  const { user } = useSelector((state: RootState) => state?.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(
    blog?.likes?.some((id) => id.toString() === user?._id?.toString())
  );
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null
  );
  const uniqueId = uuidv4();

  useEffect(() => {
    if (!user?._id) return;
    socket.emit("join", user._id);
  }, [user?._id]);

  useEffect(() => {
    socket.on("add-comment", (comment) => {
      dispatch(setComments(comment));
    });
    socket.on("delete-comment", (comment) => {
      dispatch(removeComment(comment));
    });
    socket.on("like-blog", (res) => {
      dispatch(blogLike(res));
    });
    socket.on("unlike-blog", (res) => {
      dispatch(blogUnlike(res));
    });

    socket.on("notification", (res) => {
      dispatch(setNotifications(res));
    });

    return () => {
      socket.off("add-comment");
      socket.off("delete-comment");
      socket.off("like-blog");
      socket.off("unlike-blog");
      socket.off("notification");
    };
  }, [socket, user?._id]);

  const getRandomColor = (userId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    const index =
      userId?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  const handleAddComment = async (blogId: string) => {
    setIsLoading(true);
    if (!comment) {
      toast.error("Please enter a comment.");
      setIsLoading(false);
      return;
    }
    const res = await dispatch(addComment({ blogId, comment })).unwrap();
    if (res) {
      socket.emit("add-comment", res.newComment);
      socket.emit("notification", res.newNotification);
      console.log(res.newNotification.populatedNotification);
      setComment("");
    } else {
      toast.error("Failed to add comment.");
    }
    setIsLoading(false);
  };

  const handleCommentDelete = async (blogId: string, commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const res = await dispatch(deleteComment({ blogId, commentId }));
      if (res) {
        socket.emit("delete-comment", res);
      } else {
        toast.error("Failed to delete comment.");
      }
    }
  };

  const handleLike = async (blogId: string) => {
    if (!user) return;
    setIsLiked(true);
    dispatch(blogLike({ blogId, userId: user?._id }));
    try {
      const res = await dispatch(likeBlog(blogId)).unwrap();
      if (!res) {
        setIsLiked(false);
        dispatch(blogUnlike({ blogId, userId: user?._id }));
        toast.error("Failed to like blog.");
      } else {
        socket.emit("like-blog", res);
      }
    } catch (error) {
      setIsLiked(false);
      dispatch(blogUnlike({ blogId, userId: user?._id }));
      toast.error("Failed to like blog.");
    }
  };

  const handleUnlike = async (blogId: string) => {
    if (!user) return;
    setIsLiked(false);
    dispatch(blogUnlike({ blogId, userId: user?._id }));

    try {
      const res = await dispatch(unLikeBlog(blogId)).unwrap();
      if (!res) {
        setIsLiked(true);
        dispatch(blogLike({ blogId, userId: user?._id }));
        toast.error("Failed to unlike blog.");
      } else {
        socket.emit("unlike-blog", res);
      }
    } catch (error) {
      setIsLiked(true);
      dispatch(blogLike({ blogId, userId: user?._id }));
      toast.error("Failed to unlike blog.");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Blog Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              router.push(
                `/users/profile/${uniqueId}/?userId=${blog?.userId?._id}`
              )
            }
          >
            <div
              className={`w-12 h-12 rounded-full ${getRandomColor(
                blog.userId?._id
              )} flex items-center justify-center text-white font-semibold text-lg`}
            >
              {blog?.userId?.firstName?.[0]?.toUpperCase()}
              {blog?.userId?.lastName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {blog?.userId?.firstName} {blog?.userId?.lastName}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>
                  {new Date(blog?.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Blog Content */}
        <div className="mt-4">
          <h2
            className="text-2xl font-bold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/blogs/?blogId=${blog?._id}`)}
          >
            {blog?.title}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <ReactMarkdown>{blog.content.substring(0, 400)}</ReactMarkdown>
          </div>
          {blog?.content.length > 300 && (
            <button
              onClick={() => router.push(`/blogs/?blogId=${blog?._id}`)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
            >
              {"Read Full Post"}
            </button>
          )}
        </div>

        {/* Blog Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() =>
                isLiked
                  ? handleUnlike(blog?._id?.toString())
                  : handleLike(blog?._id?.toString())
              }
            >
              {isLiked ? (
                <HandThumbUpSolid className="h-5 w-5 text-blue-600" />
              ) : (
                <HandThumbUpIcon className="h-5 w-5" />
              )}
              <span>{blog?.likes?.length}</span>
            </button>
            <button
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() =>
                document.getElementById(`comment-input-${blog?._id}`)?.focus()
              }
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{blog?.comments?.length}</span>
            </button>
          </div>
          <button
            onClick={() => router.push(`/blogs/?blogId=${blog?._id}`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
          >
            View Post <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
        {/* Comment Input */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            {user ? (
              <div
                className={`w-10 h-10 rounded-full ${getRandomColor(
                  user?._id?.toString()
                )} flex items-center justify-center text-white font-semibold`}
              >
                {user?.firstName?.[0]?.toUpperCase()}
                {user?.lastName?.[0]?.toUpperCase()}
              </div>
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              id={`comment-input-${blog?._id}`}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                // Auto-resize the textarea
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  150
                )}px`;
              }}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(blog?._id?.toString());
                }
              }}
            />
            <button
              onClick={() => handleAddComment(blog?._id?.toString())}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PaperAirplaneIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Comments List */}
        {blog?.comments?.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">
              {blog.comments.length}{" "}
              {blog.comments.length === 1 ? "Comment" : "Comments"}
            </h4>

            {blog.comments
              .slice(0, showAllComments ? blog?.comments.length : 3)
              .map((comment) => (
                <div
                  key={comment?._id?.toString()}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full ${getRandomColor(
                        comment?.userId?._id
                      )} flex items-center justify-center text-white text-xs font-semibold`}
                    >
                      {comment?.userId?.firstName?.[0]?.toUpperCase()}
                      {comment?.userId?.lastName?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white p-3 rounded-lg shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {comment?.userId?.firstName}{" "}
                            {comment?.userId?.lastName}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment?.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        {user &&
                          user?._id?.toString() === comment?.userId?._id && (
                            <div className="relative">
                              <button
                                className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  setExpandedCommentId(
                                    expandedCommentId ===
                                      comment?._id?.toString()
                                      ? null
                                      : comment?._id?.toString()
                                  )
                                }
                              >
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </button>
                              <AnimatePresence>
                                {expandedCommentId?.toString() ===
                                  comment?._id?.toString() && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-6 bg-white shadow-md rounded-md overflow-hidden z-10"
                                  >
                                    <button
                                      onClick={() =>
                                        handleCommentDelete(
                                          blog?._id,
                                          comment?._id?.toString()
                                        )
                                      }
                                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left flex items-center"
                                    >
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.commentText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {blog.comments.length > 3 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
              >
                {showAllComments
                  ? "Show fewer comments"
                  : `View all ${blog.comments.length} comments`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

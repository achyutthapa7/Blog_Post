"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  fetchBlog,
} from "../lib/features/blog/blogSlice";
import { AppDispatch, RootState } from "../lib/store";
import Loader from "./Loader";
import { IBlog } from "../db/models/blog.model";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ShowBlogs = () => {
  const { blogs, loading } = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBlog());
  }, [dispatch]);

  if (loading === "idle" || loading === "pending") {
    return <Loader />;
  }

  return (
    <div className="w-full flex items-center justify-center px-10 flex-col">
      {blogs.map((blog, index) => (
        <BlogPost key={blog?._id || index} blog={blog} />
      ))}
    </div>
  );
};

export default ShowBlogs;

const BlogPost = ({ blog }: { blog: IBlog }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreCommentsShown, setIsMoreCommentsShown] = useState(false);
  const [comment, setComment] = useState("");
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);

  const handleAddComment = async (blogId: string) => {
    setIsLoading(true);
    if (!comment) {
      toast.error("Please enter a comment.");
      setIsLoading(false);
      return;
    }
    const res = await dispatch(addComment({ blogId, comment })).unwrap();
    if (res) {
      toast.success("Comment added successfully");
      setComment("");
      setIsLoading(false);
    } else {
      toast.error("Failed to add comment.");
      setIsLoading(false);
    }
  };

  const handleCommentDelete = async (blogId: string, commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const res = await dispatch(deleteComment({ blogId, commentId }));
      if (res) {
        toast.success("Comment deleted successfully");
      } else {
        toast.error("Failed to delete comment.");
      }
    }
  };

  return (
    <div className="w-full md:w-3/4 lg:w-1/2 h-auto border border-black/20 rounded-2xl mt-10 p-2 ">
      <div className="px-5">
        <div className="flex flex-col items-start">
          <p className="text-3xl font-semibold">{blog?.title}</p>
          <p className="text-slate-400 font-extralight text-[0.9rem]">
            {new Date(blog?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-3 mt-2">
          <p className="font-light text-md tracking-wide h-[54.5px] overflow-hidden">
            {blog?.content}
          </p>
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push(`/blogs/?blogId=${blog._id}`)}
          >
            Read More...
          </span>
        </div>
        <div className="flex gap-6 mb-2">
          <div className="flex gap-2 items-center">
            <HandThumbUpIcon className="h-5 w-5" />
            <p>{blog?.likes?.length}</p>
          </div>
          <div className="flex gap-2 items-center">
            <ChatBubbleBottomCenterIcon className="h-5 w-5" />
            <p>{blog?.comments?.length}</p>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="pl-10 mt-10 flex flex-col gap-5">
        <div className="relative">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Add a comment"
            className="border border-black/15 outline-none p-2 w-full rounded-2xl pl-5 font-light focus:outline-blue-900"
          />
          {isLoading ? (
            <div className="absolute right-3 top-[9px] h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <PaperAirplaneIcon
              className="h-6 w-6 absolute right-3 top-[9px] text-blue-400 cursor-pointer hover:text-blue-500"
              onClick={() => handleAddComment(blog._id.toString())}
            />
          )}
        </div>

        {/* Comments List */}
        <div className="flex flex-col gap-4">
          {blog?.comments
            ?.slice(0, isMoreCommentsShown ? blog?.comments?.length : 3)
            .map((comment) => (
              <div
                key={comment?._id.toString()}
                className="flex items-center justify-between"
                onMouseEnter={() => setHoveredCommentId(comment._id.toString())}
                onMouseLeave={() => setHoveredCommentId(null)}
              >
                <div className="flex gap-2 items-center">
                  <div className="w-[30px] h-[30px] rounded-full bg-amber-400 flex items-center justify-center">
                    U
                  </div>
                  <div>
                    <p>
                      <span className="text-lg text-blue-700 mr-4">
                        {comment.userId.firstName}
                      </span>
                      <span className="text-black/30 font-extralight text-md">
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    <p className="text-md font-light ml-1">
                      {comment.commentText}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                {user && user._id === comment.userId._id && (
                  <div className="relative">
                    <span className="text-lg font-bold cursor-pointer">
                      ...
                    </span>
                    {hoveredCommentId === comment._id.toString() && (
                      <button
                        className="absolute right-0 bg-white border shadow-md p-2 rounded-lg text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() =>
                          handleCommentDelete(blog._id, comment._id.toString())
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          {blog?.comments?.length > 3 && (
            <button
              onClick={() => setIsMoreCommentsShown(!isMoreCommentsShown)}
              className="text-blue-500 cursor-pointer"
            >
              {isMoreCommentsShown ? "View Less" : "View More Comments"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

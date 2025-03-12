"use client";
import { users } from "@/dummy/user";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlog,
  commentOnBlog,
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

const ShowBlogs = () => {
  const { blogs, loading } = useSelector((state: RootState) => state.blog);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchBlog());
  }, [dispatch]);

  console.log("home: ", blogs);

  if (loading === "idle" || loading === "pending") {
    return <Loader />;
  }
  return (
    <div className="w-full flex items-center justify-center px-10 flex-col">
      {blogs.map((blog) => (
        <BlogPost key={blog._id as string} blog={blog} />
      ))}
    </div>
  );
};

export default ShowBlogs;

const BlogPost = ({ blog }: { blog: IBlog }) => {
  const [isMoreCommentsShown, setIsMoreCommentsShown] = useState(false);
  const showMoreComments = () => {
    setIsMoreCommentsShown(true);
  };
  return (
    <div className="w-full md:w-3/4 lg:w-1/2 h-auto border border-black/20 rounded-2xl mt-10 p-2 ">
      <div className="px-5">
        <div className="flex flex-col items-start">
          <p className="text-3xl font-semibold">{blog.title}</p>
          <p className="text-slate-400 font-extralight text-[0.9rem]">
            {new Date(blog?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-3 mt-2">
          <p className="font-light text-md tracking-wide">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            error ea, molestias corrupti obcaecati eum et in repellendus commodi
            hic beatae explicabo soluta, perferendis molestiae rerum debitis
            nulla placeat animi.
          </p>
        </div>
        <div className="flex gap-6 mb-2 ">
          <div className="flex gap-2 items-center">
            <HandThumbUpIcon className="h-5 w-5" />
            <p>{blog.likes?.length}</p>
          </div>
          <div className="flex gap-2 items-center">
            <ChatBubbleBottomCenterIcon className="h-5 w-5" />
            <p>{blog.comments?.length}</p>
          </div>
        </div>
      </div>

      <div className="pl-10 mt-10 flex flex-col gap-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Add a comment"
            className="border-1 border-black/15 outline-0 p-2 w-full rounded-2xl pl-5 font-light focus:outline-1 focus:outline-blue-900"
          />
          <PaperAirplaneIcon className="h-6 w-6 absolute right-3 top-[9px] text-blue-400 cursor-pointer hover:text-blue-500" />
        </div>

        <div className="flex flex-col gap-7">
          {blog.comments?.map((comment) => (
            <>
              <div className="flex gap-2 items-center">
                <div className="w-[30px] h-[30px] rounded-full bg-amber-400 flex items-center justify-center">
                  U
                </div>

                <div>
                  <p>
                    <span className="text-lg text-blue-700 mr-4">
                      Achyut Thapa
                    </span>
                    <span className="text-black/30 font-extralight text-md">
                      1m ago
                    </span>
                  </p>
                  <p className="text-md font-light ml-1">comment text</p>
                </div>
              </div>
            </>
          ))}
        </div>

        <p className="text-black/60 hover:text-blue-800 cursor-pointer text-sm ml-9">
          Show more comments
        </p>
      </div>
    </div>
  );
};

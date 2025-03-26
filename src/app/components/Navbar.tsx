"use client";
import {
  BellIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../lib/store";
import { useRouter } from "next/navigation";
import { fetchNotifications } from "../lib/features/notifcation/notificationSlice";
import NotificationDrawer from "./Drawer";

const Navbar = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state?.user);
  const { notifications } = useSelector(
    (state: RootState) => state?.notification
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  const uniqueId = uuidv4();
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const handleShowSearchBar = () => {
    setSearchBarOpen(!searchBarOpen);
  };
  return (
    <>
      <div className="px-5 h-[75px] flex justify-center items-center  border-b border-slate-200 sticky top-0 bg-slate-300/20 backdrop-blur-3xl shadow-md z-50 w-full">
        <div className="gap-2 items-center flex-1 hidden md:flex">
          <Link href={"/home"} className="hidden md:block">
            <span className="text-2xl font-bold text-slate-800">
              Blog-Sphere
            </span>
          </Link>
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search"
              className="border-gray-200 rounded-full outline-0 p-3 pl-10 w-[300px] bg-slate-50 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            className=""
            onClick={() => {
              redirect(`/write/blog/${uniqueId}/?redirect=${uniqueId}`);
            }}
          >
            <span className="font-extralight flex gap-1 items-center cursor-pointer">
              <PencilSquareIcon className="h-6 w-6" /> Write
            </span>
          </div>

          <div
            className="block sm:hidden cursor-pointer"
            onClick={handleShowSearchBar}
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          </div>

          <NotificationDrawer notifications={notifications} />

          <div
            className="w-[35px] h-[35px] rounded-full bg-blue-800 flex items-center justify-center text-xl text-slate-200 cursor-pointer"
            onClick={() => {
              router.push(`/users/profile/${uniqueId}/?userId=${user?._id}`);
            }}
          >
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {searchBarOpen && (
        <div className="block sm:hidden relative px-5 mt-5">
          <input
            type="text"
            placeholder="Search"
            className="border-gray-200 rounded-full outline-0 p-3 w-full pl-4 border-[1px]"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;

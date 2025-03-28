"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/store";
import { motion } from "framer-motion";
import { BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { fetchNotifications } from "../lib/features/notifcation/notificationSlice";

const ShowAllNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchNotifications());
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);
  const { notifications } = useSelector(
    (state: RootState) => state?.notification
  );
  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.h1
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BellIcon className="h-6 w-6 text-blue-500" /> Notifications
      </motion.h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <motion.ul
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {notifications.map((notification) => (
            <motion.li
              key={notification._id}
              className="p-4 bg-white shadow-md rounded-lg flex items-start gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircleIcon
                className={`h-6 w-6 ${
                  notification.read ? "text-green-500" : "text-gray-400"
                }`}
              />
              <div>
                <p className="font-medium">
                  {notification.senderId.firstName}{" "}
                  {notification.senderId.lastName} {notification.message}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default ShowAllNotifications;

import React, { useEffect, useRef, useState } from "react";
import { INotification } from "../lib/features/notifcation/notificationSlice";
import {
  BellAlertIcon,
  BellIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import { readAllNotifications } from "../utils/requests";
import { toast } from "react-toastify";

const NotificationDrawer = ({
  notifications,
}: {
  notifications: INotification[];
}) => {
  const [localNotifications, setLocalNotifications] = useState(
    notifications || []
  );
  useEffect(() => {
    setLocalNotifications(notifications || []);
  }, [notifications]);

  const router = useRouter();
  const uniqueId = uuid4();
  const notificationContainer = useRef<HTMLDivElement | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isAllRead, setIsAllRead] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);

  const unReadNotification = notifications.filter(
    (notification) => notification.read != true
  ).length;

  useEffect(() => {
    const hideDrawer = (event: Event) => {
      if (
        notificationContainer.current &&
        !notificationContainer.current.contains(event.target as Node)
      ) {
        setShowDrawer(false);
      }
    };

    const handleScroll = () => {
      setShowDrawer(false);
    };

    document.addEventListener("click", hideDrawer);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", hideDrawer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleShowDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const handleMarkAllRead = async () => {
    const res = await readAllNotifications();
    if (res?.status == 200) {
      setLocalNotifications(res.data.notifications);
      setForceRenderKey((prev) => prev + 1);
      setIsAllRead(true);
      setShowDrawer(false);
    } else {
      toast.error("Error while reading notifications, please try again");
    }
  };

  return (
    <div className="relative" ref={notificationContainer} key={forceRenderKey}>
      <div className="relative">
        <BellIcon
          className="h-8 w-8 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors duration-200"
          onClick={handleShowDrawer}
        />
        {!isAllRead && unReadNotification > 0 && (
          <span className="absolute w-5 h-5 bg-red-500 rounded-full flex justify-center items-center text-white text-xs font-bold -top-1 -right-1 animate-pulse">
            {unReadNotification > 9 ? "9+" : unReadNotification}
          </span>
        )}
      </div>

      <div
        className={`w-[380px] sm:w-[420px] absolute top-12 right-0 hidden md:block overflow-hidden ${
          showDrawer
            ? "max-h-[700px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible pointer-events-none"
        } transition-all duration-300 ease-in-out rounded-xl shadow-xl bg-white/90 backdrop-blur-lg border border-gray-100`}
      >
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BellAlertIcon className="h-5 w-5 text-blue-600" />
              Notifications
            </h2>
            <button
              className={`text-sm font-medium px-3 py-1 rounded-lg transition-all cursor-pointer ${
                isAllRead || unReadNotification === 0
                  ? "text-gray-400 pointer-events-none"
                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
              onClick={handleMarkAllRead}
              disabled={isAllRead || unReadNotification === 0}
            >
              {isAllRead || unReadNotification === 0
                ? "All read"
                : "Mark all as read"}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[600px]">
          {localNotifications.length > 0 ? (
            <>
              {localNotifications.slice(0, 12).map((notification) => (
                <div
                  key={notification?._id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    !notification.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {notification.read ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {notification?.message}
                      </p>
                      {notification?.blogId?.title && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          On: {notification?.blogId?.title}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center bg-gray-50">
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={() => {
                    setShowDrawer(false);
                    router.push(
                      `/all-notifications/${uniqueId}/?notifications=allnotifications`
                    );
                  }}
                >
                  View all notifications →
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <CheckBadgeIcon className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-sm text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex md:hidden">{/* Mobile view placeholder */}</div>
    </div>
  );
};

export default NotificationDrawer;

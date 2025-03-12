import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Trash2, Bell } from "lucide-react";
import "./index.css"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/notifications/", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, is_read: true } : notif))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notifications/${id}`, { withCredentials: true });
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2" />
        Notifications
      </h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-3 border rounded-lg flex justify-between items-center ${
                notif.is_read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div>
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                {!notif.is_read && (
                  <button onClick={() => markAsRead(notif._id)} className="text-green-500">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => deleteNotification(notif._id)} className="text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;

import React, { useState } from "react";
import { useContext } from "react";
import ColorContext from "../../context/ColorContext";
import FontContext from "../../context/FontContext";

const NotificationForm = ({ socket, fetchNotifications }) => {
  const { sidenavColor } = useContext(ColorContext);
  const { navbarFont, headingFont, paraFont } = useContext(FontContext);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("alert");

  const sendNotification = () => {
    const notificationData = { title, message, type };
    socket.emit("sendNotification", notificationData);
    fetchNotifications(); // Refresh notifications after sending
    setTitle("");
    setMessage("");
  };

  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold mb-4" style={headingFont}>Create Notification</h2>
      <div className="space-y-4">
        <div>
          <label className="block" style={navbarFont}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 p-3 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold" style={navbarFont}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 p-3 w-full border rounded-md"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold" style={navbarFont}>Notification Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 p-3 w-full border rounded-md"
          >
            {/* <option value="toast">Toast</option> */}
            <option value="alert">Alert</option>
            <option value="background">Background</option>
          </select>
        </div>
        <button
          onClick={sendNotification}
          className="mt-4 text-white py-2 px-4 rounded-md"
          style={{ backgroundColor: sidenavColor }}
        >
          Send Notification
        </button>
      </div>
    </div>
  );
};

export default NotificationForm;

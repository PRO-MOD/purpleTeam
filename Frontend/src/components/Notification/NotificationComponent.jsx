import React, { useState, useEffect, useContext } from "react";
import SocketContext from "../../context/SocketContext";
import ColorContext from "../../context/ColorContext";
import FontContext from "../../context/FontContext";
import AuthContext from "../../context/AuthContext";
import NotificationForm from "./NotificationForm"; // Import the NotificationForm component
import Modal from "../Partials/modal"; // Import the Modal component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const WT= import.meta.env.VITE_WT;

const NotificationComponent = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const { socket, notifications, fetchNotifications } = useContext(SocketContext);
    const { sidenavColor, hoverColor } = useContext(ColorContext);
    const { navbarFont, headingFont, paraFont } = useContext(FontContext);
    const { user, fetchUserRole } = useContext(AuthContext); // Fetch user from AuthContext

    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
    const [editNotification, setEditNotification] = useState(null); // Store the notification being edited

    // Fetch notifications when the component mounts
    useEffect(() => {
        fetchNotifications();
        fetchUserRole(); // Ensure that the user data (including role) is fetched
    }, []); //fetchNotifications, fetchUserRole

    // Handle Delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/notifications/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchNotifications(); // Refresh notifications after deletion
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    // Open the Edit Modal with pre-filled data
    const handleEdit = (notification) => {
        setEditNotification(notification); // Set the notification to be edited
        setIsModalOpen(true); // Open the modal
    };

    // Handle Edit Submit
    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/notifications/${editNotification._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editNotification.title,
                    message: editNotification.message,
                }),
            });
            if (response.ok) {
                fetchNotifications(); // Refresh notifications after update
                setIsModalOpen(false); // Close the modal
                setEditNotification(null); // Reset the edit notification
            } else {
                console.error('Failed to update notification');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditNotification(null); // Reset notification state when closing the modal
    };

    return (
        <div className="p-6">
            {/* Conditionally render the NotificationForm only if the user is an admin */}
            {user?.role === WT && (
                <NotificationForm socket={socket} fetchNotifications={fetchNotifications} />
            )}

            {/* Display Previous Notifications */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4" style={navbarFont}>Previous Notifications</h2>
                <div className="space-y-4">
                    {notifications?.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div
                                key={notification._id || index} // Use a unique id if available
                                className="card shadow-lg rounded-md p-4"
                                style={{ backgroundColor: "white", border: "1px solid #ddd" }}
                            >
                                <div className="card-body">
                                    <h3 className="card-title font-semibold">{notification.title}</h3>
                                    <blockquote className="blockquote mb-0">
                                        <p>{notification.message}</p>
                                        <small className="text-muted">
                                            <span data-time={notification.createdAt}>{new Date(notification.createdAt).toString().slice(0, 25)}</span>
                                        </small>
                                    </blockquote>

                                    {/* Admin can Edit or Delete */}
                                    {user?.role === WT && (
                                        <div className="mt-2 flex justify-end space-x-4"> {/* Flex to align icons to the right */}
                                            <button
                                                style={{ color: hoverColor }}
                                                onClick={() => handleEdit(notification)} // Open modal to edit notification
                                                aria-label="Edit notification"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(notification._id)} // Delete notification
                                                aria-label="Delete notification"
                                                style={{ color: sidenavColor }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="mt-4 text-center text-gray-500">
                            <p>No notifications available</p> {/* Message when there are no notifications */}
                        </div>
                    )}

                </div>
            </div>

            {/* Modal for Editing */}
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                title="Edit Notification"
                onSubmit={handleEditSubmit}
            >
                <div>
                    <div>
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            value={editNotification?.title || ''}
                            onChange={(e) =>
                                setEditNotification({
                                    ...editNotification,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea
                            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                            value={editNotification?.message || ''}
                            onChange={(e) =>
                                setEditNotification({
                                    ...editNotification,
                                    message: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default NotificationComponent;

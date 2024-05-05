import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';

function ChatInput({ recipientId, socket }) {
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const context = useContext(AuthContext);
    const { user, fetchUserRole } = context;

    useEffect(() => {
        const getUserRole = async () => {
            try {
                await fetchUserRole();
            } catch (error) {
                setError('Error fetching user role');
            }
        };
        getUserRole();
    }, []);

    // Function to handle changes in the message input field
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleImageChange = (e) => {
        setImages(prevImages => [...prevImages, ...e.target.files]);
    }
    // console.log(images);

    // Function to handle message submission
    // Function to handle message submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Reset previous error message
        setError('');

        try {
            const formData = new FormData(); // Create FormData object
            formData.append('recipient', recipientId); // Add recipient to FormData
            formData.append('content', message); // Add content to FormData
            images.forEach((image, index) => {
                formData.append(`images`, image); // Add each image to FormData
            });

            socket?.emit('sendMessage', {
                senderId: user._id, recipient: recipientId, content: message, images: images
            });

            const response = await fetch('http://13.233.214.116:5000/api/chat/send-message', {
                method: 'POST',
                headers: {
                    "Auth-token": localStorage.getItem('Hactify-Auth-token')
                },
                body: formData // Send FormData instead of JSON.stringify
            });

            if (!response.ok) {
                // Handle non-200 status codes
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            console.log('Message sent:', data);

            // Clear the message input field after sending the message
            setMessage('');
            setImages([]);

            // Fetch updated messages
            // fetchMessages(); // You need to define this function or call it from a parent component
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.'); // Set error message
        }
    };

    return (
        <div>
            <form className="flex items-center justify-between m-2 mt-auto" onSubmit={handleSubmit}>
                <textarea
                    className="flex-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 resize-none"
                    type="text"
                    placeholder="Enter Msg here"
                    value={message}
                    onChange={handleMessageChange}
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
                <label htmlFor="file-input" className="ml-2 cursor-pointer">
                    <FontAwesomeIcon icon={faImage} />
                </label>
                <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message if it exists */}
        </div>
    );
}

export default ChatInput;

import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ChatInput({ recipientId, socket, userId }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Function to handle changes in the message input field
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // Function to handle message submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Reset previous error message
        setError('');

        try {

            socket?.emit('sendMessage', {
                senderId: userId, recipient: recipientId, content: message
            })

            const response = await fetch('http://localhost:5000/api/chat/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token')
                },
                body: JSON.stringify({ recipient: recipientId, content: message })
            });
            if (!response.ok) {
                // Handle non-200 status codes
                throw new Error('Failed to send message');
            }
            const data = await response.json();
            console.log('Message sent:', data);

            // Clear the message input field after sending the message
            setMessage('');

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

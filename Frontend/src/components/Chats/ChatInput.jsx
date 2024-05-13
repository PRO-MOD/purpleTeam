import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

function ChatInput({ socket }) {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const { userId } = useParams(); // recipientID
    // console.log("userId:>> " + userId);
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

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
        const selectedImages = Array.from(e.target.files);
        setImages(selectedImages);

        // Generate preview images
        const previews = selectedImages.map(image => URL.createObjectURL(image));
        setImagePreviews(previews);
    }

    // Function to remove an image from the selected images array
    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);

        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
    };

    // Function to handle message submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Reset previous error message
        setError('');
        setLoading(true); // Set loading to true

        try {
            const formData = new FormData(); // Create FormData object
            formData.append('recipient', userId); // Add recipient to FormData
            formData.append('content', message); // Add content to FormData
            images.forEach((image, index) => {
                formData.append(`images`, image); // Add each image to FormData
            });

            socket?.emit('sendMessage', {
                senderId: user._id, recipient: userId, content: message, images: images
            });

            const response = await fetch(`${apiUrl}/api/chat/send-message`, {
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
            setImagePreviews([]);
            // Fetch updated messages
            // fetchMessages(); // You need to define this function or call it from a parent component
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false after submission
        }
    };

    return (
        <div>
            {imagePreviews.map((preview, index) => (
                <div key={index} className="relative inline-block">
                    <img src={preview} alt="Preview" className="w-16 h-16 mr-2 rounded" />
                    <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center -mt-1 -mr-1 hover:bg-red-600 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            <form className="flex items-center justify-between m-2 mt-auto" onSubmit={handleSubmit}>
                <input
                    className={`flex-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 resize-none ${images.length === 0 ? 'required' : ''}`}
                    type="text"
                    placeholder="Enter Msg here"
                    value={message}
                    onChange={handleMessageChange}
                    required={images.length === 0} // Apply 'required' attribute conditionally
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
                    disabled={loading} // Disable the button when loading
                >
                    {loading ? <span><img className='w-6' src="../../loading.gif" alt="loading..." /></span> : <FontAwesomeIcon icon={faPaperPlane} />}
                </button>
            </form>
            
            {error && <p className="text-red-500">{error}</p>} {/* Display error message if it exists */}
        </div>
    );
}

export default ChatInput;

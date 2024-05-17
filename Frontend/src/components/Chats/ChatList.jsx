import React, { useState, useEffect, useContext } from 'react';
import { ChatItem } from "react-chat-elements";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SocketContext from '../../context/SocketContext';
import "../../App.css";

function ChatLists({ position }) {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [conversations, setConversations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const navigate = useNavigate();

    // import all context
    const { unreadMessages, fetchUnreadMessages, unreadCounts, fetchUnreadMessagesByUser } = useContext(SocketContext);

    useEffect(() => {
        if (position === 'left') {
            fetchConversations();
        } else if (position === 'right') {
            fetchVolunteers();
        }
    }, [position]);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/chat/conversations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
            const data = await response.json();
            data.sort((a, b) => new Date(b.latestMessageDate) - new Date(a.latestMessageDate));
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/getallVolunteer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const handleChatItemClick = async (recipientId) => {
        navigate(`/chat/${recipientId}`);
        await fetchUnreadMessages();
        await fetchUnreadMessagesByUser();
    };

    useEffect(() => {
        fetchUnreadMessagesByUser();
    }, []);

    // Filter volunteers based on search query
    const filteredVolunteers = volunteers.filter(volunteer =>
        volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col max-h-screen">
            {position === 'left' && conversations.map((conversation, index) => (
                <ChatItem
                    key={index}
                    avatar={conversation.recipient.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={conversation.recipient.name}
                    title={conversation.recipient.name}
                    subtitle={conversation.latestMessageContent}
                    date={new Date(conversation.latestMessageDate)}
                    unread={unreadCounts[conversation.recipient._id]}
                    onClick={() => handleChatItemClick(conversation.recipient._id)}
                />
            ))}
            {position === 'right' && (
                <>
                    <div className="p-4 bg-white flex items-center justify-center">
                        {showSearchInput ? (
                             <>
                             <input
                                 type="text"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 placeholder="Search Volunteers"
                                 className="p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none flex-1"
                             />
                             <FontAwesomeIcon
                                 icon={faTimes}
                                 className="text-gray-500 cursor-pointer ml-2 mb-2" 
                                 onClick={() => {
                                     setSearchQuery(''); 
                                     setShowSearchInput(false); 
                                 }}
                             />
                         </>
                        ) : (
                            <>
                                <h1 className='flex-1'>Start Conversation...</h1>
                                <FontAwesomeIcon icon={faSearch} className="text-gray-500 cursor-pointer" onClick={() => setShowSearchInput(true)} />
                            </>
                        )}
                    </div>
                    <hr />
                </>
            )}
            {position === 'right' && filteredVolunteers.map((volunteer, index) => (
                <ChatItem
                    key={index}
                    avatar={volunteer.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={volunteer.name}
                    title={volunteer.name}
                    onClick={() => handleChatItemClick(volunteer._id)}
                />
            ))}
        </div>
    );
}

export default ChatLists;

import React, { useState, useEffect, useContext } from 'react';
import { ChatItem } from "react-chat-elements";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SocketContext from '../../context/SocketContext';
import "../../App.css";
import AuthContext from '../../context/AuthContext';
import FontContext from '../../context/FontContext';
const BT = import.meta.env.VITE_BT;

function ChatLists({ position }) {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [conversations, setConversations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchInput, setShowSearchInput] = useState(false);
    const navigate = useNavigate();
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    const context = useContext(AuthContext);
    const { user, fetchUserRole } = context;
    const [error, setError] = useState(null);
  
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

    // import all context
    const { unreadMessages, fetchUnreadMessages, unreadCounts, fetchUnreadMessagesByUser } = useContext(SocketContext);

    useEffect(() => {
        if (position === 'left') {
            fetchConversations();
        } else if (position === 'right') {
           { user && ( fetchVolunteers() )}
        }
    }, [position, user]);

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

    // const fetchVolunteers = async () => {
    //     try {
    //         const response = await fetch(`${apiUrl}/api/auth/getusersall`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
    //             }
    //         });
    //         const data = await response.json();
    //         setVolunteers(data);
    //     } catch (error) {
    //         console.error('Error fetching volunteers:', error);
    //     }
    // };

    const fetchVolunteers = async () => {
        try {
           
            const userRole = user.role 
    
            // Determine the correct API based on the user's role
            const apiEndpoint = userRole === BT
                ? `${apiUrl}/api/auth/getWhiteUsersall` 
                : `${apiUrl}/api/auth/getusersall`;
    
            const response = await fetch(apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
    
            const data = await response.json();
            setVolunteers(data); // Assuming setVolunteers is the method to update state with the fetched data
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
        volunteer.name && volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col overflow-y-scroll">
            {position === 'left' && conversations.map((conversation, index) => (
                <ChatItem
                    key={index}
                    avatar={conversation?.recipient?.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={conversation?.recipient?.name}
                    title={conversation?.recipient?.name}
                    subtitle={conversation?.latestMessageContent}
                    date={new Date(conversation?.latestMessageDate)}
                    unread={unreadCounts[conversation?.recipient?._id]}
                    onClick={() => handleChatItemClick(conversation?.recipient?._id)}
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
                                <h1 className='flex-1' style={{fontFamily:headingFont}}>Start Conversation...</h1>
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

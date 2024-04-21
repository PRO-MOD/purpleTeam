import React from 'react'
import { Input, Avatar, Button } from 'react-chat-elements'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ChatWindow() {
    return (
        <div className='flex flex-col h-screen'>
            {/* Profile View */}
            <div className="flex flex-row items-center h-[50px] bg-white m-4 rounded-full ">
                <Avatar className='mx-4 rounded-full'
                    src="https://avatars.githubusercontent.com/u/80540635?v=4"
                    alt="avatar"
                    size="large"
                    type="rounded"
                />
                <div className="flex flex-col">
                    <h1>Kursat</h1>
                    <h1>Kursat@gmail.com</h1>
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                {/* in case of no message it will be displayed */}
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">No messages yet</h2>
                    <p className="text-gray-600">Start a conversation to see messages here.</p>
                </div>
                {/* Add more chat messages or content here */}
            </div>

            {/* Messaging input */}
            <form className="flex items-center justify-between m-2 mt-auto ">
                <textarea
                    className="flex-1 w-full h-12 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="Enter Msg here"
                    value=""
                    // onChange="{onChange}"
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                    // onClick="{onSubmit}"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </form>
        </div>
    )
}

export default ChatWindow

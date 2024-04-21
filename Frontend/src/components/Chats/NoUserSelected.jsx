import React from 'react';

function NoUserSelected() {
    return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">No user selected</h2>
                <p className="text-gray-600">Start a conversation by selecting a user from the list.</p>
            </div>
    );
}

export default NoUserSelected;

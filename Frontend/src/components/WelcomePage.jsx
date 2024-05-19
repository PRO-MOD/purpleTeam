import React from 'react';

const Welcome = () => {
    return (
        <div className="relative h-screen flex flex-col items-center bg-white">
            {/* Header */}

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow p-8">
                <img src="\Cyber Suraksha.png" alt="Cyber Suraksha Logo" className="w-128 h-64 mb-8" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Defend the Flag</h2>
                <p className="text-gray-600 text-center max-w-lg">
                    Welcome to the Cyber Suraksha Platform! Our mission is to empower you with the skills and knowledge to protect and defend against cyber threats. Join us in our journey to a safer digital world.
                </p>
            {/* Footer */}
            <footer className="text-center text-red-500 text-lg mt-16">
                Powered By Hacktify
            </footer>
            </div>

        </div>
    );
};

export default Welcome;

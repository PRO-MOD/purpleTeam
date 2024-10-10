import React from 'react';

const HelpCenter = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between h-screen gap-8 p-4 md:p-8">
            {/* Left Section */}
            <div 
                className="relative flex-1 bg-cover bg-center rounded-2xl shadow-lg shadow-gray-500/50 transition duration-300 hover:shadow-2xl hover:shadow-gray-500/70" 
                style={{ backgroundImage: `url('https://themenectar.com/img/demo-media/promo/helpcenter.webp')` }}
            >
                <div className="absolute top-4 left-4 w-full md:w-1/2 p-4 md:p-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">Breachpoint Help Center</h3>
                    <p className="text-base md:text-lg text-black">
                        Our comprehensive knowledge base helps you to get started and acquainted on the portal in minutes. It’s designed to make the process smoother and more efficient.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div 
                className="relative flex-1 bg-cover bg-center rounded-2xl shadow-lg shadow-gray-500/50 transition duration-300 hover:shadow-2xl hover:shadow-gray-500/70" 
                style={{ backgroundImage: `url('https://themenectar.com/img/demo-media/promo/promo-docs.jpeg')` }}
            >
                <div className="absolute top-4 left-4 w-full md:w-1/2 p-4 md:p-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Free Consultation and Onboarding Support</h3>
                    <p className="text-base md:text-lg text-white">
                        Breachpoint helps organisations kick-off their bug bounty programs by understanding your requirements, offering easy onboarding, and providing round-the-clock support to ensure a seamless experience.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;

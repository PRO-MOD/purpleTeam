import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#1c3553] text-white py-10">
            <div className="container px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mx-16">
                {/* Left Section */}
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-4">
                        Get started with our hassle-free, easy to use bug bounty platform
                    </h3>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <button className="bg-[#1d75e8] text-white py-2 px-4 rounded-sm font-medium text-lg">
                            Register as a Company
                        </button>
                        <button className="bg-[#1d75e8] text-white py-2 px-4 rounded-sm font-medium text-lg">
                            Register as a Researcher
                        </button>
                    </div>
                </div>

                {/* Middle Section (Address) */}
                <div className="text-center md:text-left">
                    <h4 className="font-bold mb-4 text-lg">Address</h4>
                    <div className="grid grid-cols-1 gap-1 font-medium text-base leading-relaxed">
                        <span>Breachpoint Private Limited</span>
                        <span>2nd Floor, Livin Corner,</span>
                        <span>10, Temple Road, Vontikoppal,</span>
                        <span>Mysuru, Karnataka 570006</span>
                    </div>
                </div>

                {/* Right Section (Contact and Recognitions) */}
                <div className="text-center md:text-left">
                    <h4 className="font-bold mb-4 text-lg">Connect</h4>
                    <div className="grid grid-cols-1 gap-1 font-medium text-base leading-relaxed">
                        <span>T: +91 81602 06309</span>
                        <span>E: support@breachpoint.app</span>
                    </div>

                    <h4 className="font-bold mt-6 mb-4 text-lg">Recognitions</h4>
                    <div className="flex flex-col space-y-4 items-center md:items-start">
                        <img
                            src="https://breachpoint.app/wp-content/uploads/2022/12/609-6094516_transparent-startup-india-logo-hd-png-download-1.png"
                            alt="Startup India logo"
                            className="h-12"
                        />
                        <img
                            src="https://breachpoint.app/wp-content/uploads/2024/02/Startup-Karnataka.png"
                            alt="Startup Karnataka logo"
                            className="h-12"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mx-20 flex flex-col items-center justify-between md:flex-row mt-20">
                <p className="text-lg text-center font-light">
                    &copy; 2024 Breachpoint Private Limited. Made in India with{' '}
                    <span className="text-red-600">❤️</span>
                </p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="hover:underline text-lg underline">Terms & Conditions</a>
                    <a href="#" className="hover:underline text-lg underline">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

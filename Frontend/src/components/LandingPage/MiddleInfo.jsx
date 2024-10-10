import React from 'react';

const MiddleInfo = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 z-10">
      <div className="flex flex-row w-full max-w-6xl p-4 rounded-lg">
        
        {/* For Companies Section */}
        <div className="flex-1 p-4 bg-[#0054a6] text-white rounded-lg shadow-lg m-2">
          <h3 className="text-2xl mb-2">For Companies</h3>
          <p>
            Breach Point can save millions to your organisation from cyberattacks. Get started on the portal for free and get complete autonomy on the prizes/bounties for bugs reported.
          </p>
          <div className="flex justify-center">
            <img
              className="mt-4 h-48 w-48 object-cover"
              src="https://breachpoint.app/wp-content/uploads/2022/10/3826039-300x300.jpg"
              alt="Company"
            />
          </div>
        </div>

        {/* Right Side Container for Researchers and Private Platform */}
        <div className="flex flex-col flex-1">
          {/* For Researchers Section */}
          <div className="flex-1 p-4 bg-[#1976d1] text-white rounded-lg shadow-lg m-2 flex relative">
            <div className="w-2/3">
              <h3 className="text-2xl mb-2">For Researchers</h3>
              <p>
                Earn rewards and recognition for reporting bugs, especially those related to security exploits and vulnerabilities, legally and ethically.
              </p>
            </div>
            <div className="absolute bottom-0 right-4 w-1/3 overflow-hidden">
              <img
                className="object-cover h-full transition-transform duration-300 transform translate-y-1/2" // Moves image up to hide 30% from the bottom
                src="https://breachpoint.app/wp-content/uploads/2022/10/bug.png"
                alt="Researcher"
              />
            </div>
          </div>

          {/* Private Platform Section */}
          <div className="h-32 p-4 bg-white text-gray-800 rounded-lg shadow-lg m-2">
            <h3 className="text-2xl mb-2">Private Platform</h3>
            <p>
              Welcome to our private platform where you can collaborate securely and efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiddleInfo;

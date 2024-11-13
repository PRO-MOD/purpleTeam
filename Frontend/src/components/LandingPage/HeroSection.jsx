import React, { useState, useEffect,useContext } from 'react';
import FontContext from '../../context/FontContext';
import ColorContext from '../../context/ColorContext';

const HeroSection = () => {
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  // Define the middle phrases that will change
  const phrases = ["attack surface", "cyber defense", "cybersecurity"];
  
  // State to keep track of the current phrase
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  // Effect to change the phrase every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prevPhrase) => {
        const currentIndex = phrases.indexOf(prevPhrase);
        const nextIndex = (currentIndex + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [phrases]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full py-16 px-20">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full text-center lg:text-left mb-10 lg:mb-0">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-600 leading-tight" style={{fontFamily:headingFont.fontFamily, color:sidenavColor}}>
          Changing the <span className="" style={{color:hoverColor}}>{currentPhrase}</span> landscape
        </h1>
        <p className="text-gray-600 mt-4 text-lg" style={{fontFamily:paraFont.fontFamily, color:textColor}}>
        Crysalen brings together companies and researchers through its cutting-edge hackathon and cybersecurity training platform, offering comprehensive solutions to enhance security in an ever-evolving threat landscape
        </p>
        {/* Buttons */}
        <div className="mt-8 flex justify-center lg:justify-start gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" onClick={()=> window.location.href = '/signin'}style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize, backgroundColor:sidenavColor}}>
            Start a Program🏆
          </button>
          {/* <button className="text-black px-6 py-3 rounded-lg hover:underline" style={{fontFamily: navbarFont}}>
            <span className="mr-2">🏆</span> Win Bounties
          </button> */}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
        <img
          src="https://breachpoint.app/wp-content/uploads/2022/09/17-September-outline-05-2048x1365.png "
          alt="Illustration"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default HeroSection;

import React, {useContext} from 'react';
import ColorContext from '../../../context/ColorContext'
import FontContext from '../../../context/FontContext';

const ChallengeButton = ({ challenge, onClick, solved }) => {
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);  

  return (
    <div className="mb-4">
      <button
        onClick={() => onClick(challenge)} // ${solved ? 'bg-green-500  hover:bg-green-400' : `bg-gray-800 hover:bg-gray-700`}
        className={` text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg w-full transition duration-300`}
        style={{backgroundColor: solved ? '#a7e6ff' : sidenavColor,fontFamily: headingFont }}
      >
        {challenge.name}
        <div className="text-xl mt-2"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{challenge.value}</div>
      </button>
    </div>
  );
};

export default ChallengeButton;

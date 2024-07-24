

import React from 'react';

const ChallengeButton = ({ challenge, onClick, solved }) => {
  return (
    <div className="mb-4">
      <button
        onClick={() => onClick(challenge)}
        className={`${
          solved ? 'bg-green-500' : 'bg-gray-800'
        } text-white text-lg font-semibold py-6 px-12 rounded-lg shadow-lg w-full hover:bg-gray-700 transition duration-300`}
      >
        {challenge.name}
        <div className="text-xl mt-2">{challenge.value}</div>
      </button>
    </div>
  );
};

export default ChallengeButton;

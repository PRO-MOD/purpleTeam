import React, { useEffect, useState } from 'react';
import PageHeader from '../navbar/PageHeader';
import ChallengeButton from '../ChallengeButtons/buttons';
import Modal from '../modal/modal';

const UserChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:80/api/challenges/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleButtonClick = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
    setAnswer('');
    setAttempts(0);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if(selectedChallenge.type === 'manual_verification'){
      setFeedback('Your response is submitted for Review!');

    }

    if (selectedChallenge.type === 'code') {
      // Handle code challenge submission
     
      
      const isCorrect = answer.trim() === selectedChallenge.flag.trim();
    

      if (isCorrect) {
        setFeedback('Correct answer!');
        setChallenges(prevChallenges =>
          prevChallenges.map(challenge =>
            challenge._id === selectedChallenge._id
              ? { ...challenge, solved_by_me: true }
              : challenge
          )
        );
      } else {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= 3) {
          setFeedback('No more attempts left');
          setTimeout(closeModal, 2000); // Close modal after 2 seconds
        } else {
          setFeedback('Wrong answer, try again.');
        }
      }
    } else {
      // Handle other challenge types (e.g., standard, multiple_choice)
      const isCorrect = selectedChallenge.flag_data === 'case_sensitive'
        ? answer === selectedChallenge.flag
        : answer.toLowerCase() === selectedChallenge.flag.toLowerCase();

      if (isCorrect) {
        setFeedback('Correct answer!');
        setChallenges(prevChallenges =>
          prevChallenges.map(challenge =>
            challenge._id === selectedChallenge._id
              ? { ...challenge, solved_by_me: true }
              : challenge
          )
        );
      } else {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= 3) {
          setFeedback('No more attempts left');
          setTimeout(closeModal, 2000); // Close modal after 2 seconds
        } else {
          setFeedback('Wrong answer, try again.');
        }
      }
    }
  };

  const groupByCategory = (challenges) => {
    return challenges.reduce((acc, challenge) => {
      if (!acc[challenge.category]) {
        acc[challenge.category] = [];
      }
      acc[challenge.category].push(challenge);
      return acc;
    }, {});
  };

  const groupedChallenges = groupByCategory(challenges);

  return (
    <>
      <PageHeader pageTitle="Challenges" />
      <div className="container mx-auto p-4">
        {Object.keys(groupedChallenges).map((category, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupedChallenges[category].map((challenge, index) => (
                <ChallengeButton
                  key={index}
                  challenge={challenge}
                  onClick={handleButtonClick}
                  solved={challenge.solved_by_me}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedChallenge && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          challenge={selectedChallenge}
          answer={answer}
          setAnswer={setAnswer}
          handleSubmit={handleSubmit}
          attempts={attempts}
          feedback={feedback}
        />
      )}
    </>
  );
};

export default UserChallengePage;

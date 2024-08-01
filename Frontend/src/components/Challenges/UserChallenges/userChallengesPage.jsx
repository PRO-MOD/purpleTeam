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
  const [updatedValue, setUpdatedValue] = useState(0);
  const [solvedChallenges, setSolvedChallenges] = useState([]); // New state




  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('http://localhost:80/api/challenges/all', {
          headers: {
            'Content-Type': 'application/json',
            'Auth-token': localStorage.getItem('Hactify-Auth-token')
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    const fetchSolvedChallenges = async () => {
      try {

        const response = await fetch('http://localhost:80/api/challenges/solved', {
          headers: {
            'Content-Type': 'application/json',
            'Auth-token': localStorage.getItem('Hactify-Auth-token')
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSolvedChallenges(data.map(solved => solved.challenge_id));
      } catch (error) {
        console.error('Error fetching solved challenges:', error);
      }
    };

    fetchChallenges();
    fetchSolvedChallenges();
  }, []);

  const handleButtonClick = (challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
    setUpdatedValue(challenge.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
    setAnswer('');
    setAttempts(0);
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (selectedChallenge.type === 'manual_verification') {
      setFeedback('Your response is submitted for Review!');
    } else if (selectedChallenge.type === 'code' || selectedChallenge.type === 'standard' || selectedChallenge.type === 'multiple_choice') {
      try {

        const response = await fetch('http://localhost/api/challenges/verify-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Auth-token': localStorage.getItem('Hactify-Auth-token')
          },
          body: JSON.stringify({
            challengeId: selectedChallenge._id,
            answer,
            updatedValue,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.correct) {
          setFeedback('Correct answer!');
          setSolvedChallenges(prevSolved => [...prevSolved, selectedChallenge._id]); // Update solved challenges state
          setTimeout(closeModal, 2000); // Close the modal after a delay
        } else {
          setAttempts(prev => prev + 1);
          if (attempts + 1 >= selectedChallenge.max_attempts) {
            setFeedback('No more attempts left');
            setTimeout(closeModal, 2000); // Close the modal after a delay
          } else {
            setFeedback('Wrong answer, try again.');
          }
        }
      } catch (error) {
        console.error('Error verifying answer:', error);
        setFeedback('Error verifying answer');
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
                  solved={solvedChallenges.includes(challenge._id)} // Check if solved
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
          updatedValue={updatedValue}
          setUpdatedValue={setUpdatedValue}
          solvedChallenges={solvedChallenges} // Pass solved challenges
        />
      )}
    </>
  );
};

export default UserChallengePage;

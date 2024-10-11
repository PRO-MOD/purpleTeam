import React, { useEffect, useState,useContext } from 'react';
import Select from 'react-select'; // Import Select component
import FontContext from '../../context/FontContext';

const AddModal = ({ onClose, repositoryId }) => {

  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [challenges, setChallenges] = useState([]); // State to hold fetched challenges
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const [selectedChallenges, setSelectedChallenges] = useState([]); // State for selected challenges
  const [loading, setLoading] = useState(true); // Loading state
  const [addedChallenges, setAddedChallenges] = useState([]); // State for already added challenges

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Fetch all challenges
        const response = await fetch(`${apiUrl}/api/challenges/toDisplayAllChallenges`);
        const allChallenges = await response.json();

        // Fetch challenges that are already added to the repository
        const addedResponse = await fetch(`${apiUrl}/api/repositories/${repositoryId}/challenges`);
        const addedData = await addedResponse.json();
        setAddedChallenges(addedData.map(challenge => challenge._id)); // Store IDs of added challenges

        // Filter out challenges that are already added
        const filteredChallenges = allChallenges.filter(
          (challenge) => !addedData.some((added) => added._id === challenge._id)
        );

        const options = filteredChallenges.map(challenge => ({
          value: challenge._id,
          label: `${challenge.name} - ${challenge.value} points`, // Custom label
        }));

        // Add "Select All" as the first option
        const selectAllOption = {
          value: 'select-all',
          label: 'Select All',
        };

        setChallenges([selectAllOption, ...options]); // Set "Select All" at the top
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchChallenges();
  }, [repositoryId]);

  const handleChange = (selected) => {
    if (selected.some(option => option.value === 'select-all')) {
      // If "Select All" is selected, select all challenges
      if (selectedChallenges.length === challenges.length - 1) {
        setSelectedChallenges([]); // Deselect all if already selected
      } else {
        setSelectedChallenges(challenges.slice(1)); // Select all excluding the "Select All" option
      }
    } else {
      setSelectedChallenges(selected); // Update selected challenges
    }
  };

  const handleAddChallenges = async () => {
    const challengeIds = selectedChallenges.map(challenge => challenge.value); // Extract IDs
    try {
      await fetch(`${apiUrl}/api/repositories/${repositoryId}/challenges/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId: challengeIds }), // Send selected challenges
      });
      alert('Challenges added successfully!'); // Notify user
      onClose(); // Close modal
    } catch (error) {
      console.error('Error adding challenges:', error);
      alert('Failed to add challenges.'); // Notify user of failure
    }
  };

  if (loading) {
    return <p>Loading challenges...</p>; // Loading message
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4" style={{fontFamily:headingFont}}>Select Challenges to Add</h2>
        <Select
          isMulti
          options={challenges}
          value={selectedChallenges}
          onChange={handleChange}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select challenges..."
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: '#ccc', // Change the border color
              boxShadow: 'none', // Remove shadow
              '&:hover': {
                borderColor: '#3ABEF9', // Change border color on hover
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: '#A7E6FF', // Background color for selected items
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: '#000', // Color for selected item labels
            }),
          }}
          
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={handleAddChallenges}style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}
          >
            Add Challenges
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
            onClick={onClose}style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;

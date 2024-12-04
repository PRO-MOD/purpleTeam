import React, { useState, useEffect, useContext } from 'react';
import CodeEditor from '../challenges/CodeEditor/CodeEditorFeild';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import FontContext from '../../../context/FontContext';

const Modal = ({
  isOpen,
  onClose,
  challenge,
  answer,
  setAnswer,
  handleSubmit,
  attempts,
  feedback,
  updatedValue,
  solvedChallenges,
  totalAttempts,

}) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const {navbarFont, headingFont, paraFont}=useContext(FontContext);
  const [formData, setFormData] = useState({ language: 'python', flag: '' });
  const [editorOutput, setEditorOutput] = useState('');
  const [hintsModalOpen, setHintsModalOpen] = useState(false);
  const [hints, setHints] = useState([]);
  const [selectedHint, setSelectedHint] = useState(null);
  const [usedHints, setUsedHints] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showHintDetails, setShowHintDetails] = useState(false);
  const [message, setMessage] = useState('');
  const [containerData, setContainerData] = useState({});
  const [isServerStopped, setIsServerStopped] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [cost , setCost] = useState(0);
 
  useEffect(() => {
    if (!isOpen) {
      setHintsModalOpen(false);
      setHints([]);
      setSelectedHint(null);
      setUsedHints([]);
    } else {
      fetchUsedHints();
    }
  }, [isOpen, challenge]);



  //for getting ids of used hints 
  const fetchUsedHints = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/used-hints/${challenge._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Auth-token': localStorage.getItem('Hactify-Auth-token')
        },

      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsedHints(data.map(hint => hint.hint_id));
    } catch (error) {
      console.error('Error fetching used hints:', error);
    }
  };


  //for getting ids of all the hints of the paeticular challenge
  const fetchHints = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/challenges/hints/${challenge._id}`, {
        method: 'GET',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHints(data[0].hints || []);
      setHintsModalOpen(true);
    } catch (error) {
      console.error('Error fetching hints:', error);
    }
  };


  //for getting cost of hint before unlocking it 
  const costOfHint = async (hintId) => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/cost/${hintId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

     
       
        setCost(data);
     
    } catch (error) {
      console.error('Error fetching hint details:', error);
    }
  };


  //detail of hint by using id
  const fetchHintDetails = async (hintId) => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/hints/${hintId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.length > 0) {
        setSelectedHint(data[0]);
        setShowHintDetails(true);
      } else {
        setSelectedHint(null);
        setShowHintDetails(false);
      }
    } catch (error) {
      console.error('Error fetching hint details:', error);
    }
  };

  const fetchLockedHintDetails = async (hintId) => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/locked/hints/${hintId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.length > 0) {
        return data[0]; // Return the full hint object
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching hint details:', error);
      return null;
    }
  };





  // const confirmUnlockHint = async () => {
  //   if (!selectedHint) return;
  
  //   setShowWarning(false);
  
  //   // Fetch hint details
  //   const hintDetails = await fetchLockedHintDetails(selectedHint);
  //   if (!hintDetails) return;
  
  //   setSelectedHint(hintDetails); // Set the selected hint to the full hint object
  
  //   // Unlock hint through backend
  //   try {
  //     const response = await fetch(`${apiUrl}/api/hints/use-hint`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Auth-token': localStorage.getItem('Hactify-Auth-token'),
  //       },
  //       body: JSON.stringify({
  //         challengeId: challenge._id,
  //         hintId: hintDetails._id,
  //       }),
  //     });
  
  //     const result = await response.json();
  
  //     if (response.status === 400) {
  //       // Insufficient score
  //       alert('Insufficient score to unlock this hint.');
  //       return;
  //     }
  
  //     if (response.status !== 200) {
  //       // Other errors
  //       alert('Failed to unlock hint. Please try again.');
  //       return;
  //     }
  
  //     // Success: Update local state with the unlocked hint and remaining score
  //     setUsedHints(prevHints => [...prevHints, hintDetails._id]); // Mark hint as used
  //     setShowHintDetails(true); // Show hint details
  
  //   } catch (error) {
  //     console.error('Error unlocking hint:', error);
  //     alert('Something went wrong. Please try again.');
  //   }
  // };
  

  const confirmUnlockHint = async () => {
    if (!selectedHint) return;

    console.log(selectedHint);
  
    setShowWarning(false);
  
    // Unlock hint through backend
    try {
      const response = await fetch(`${apiUrl}/api/hints/use-hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          hintId: selectedHint,
        }),
      });
  
      if (response.status === 400) {
        // Insufficient score
        alert('Insufficient score to unlock this hint.');
        return;
      }
  
      if (response.status !== 200) {
        // Other errors
        alert('Failed to unlock hint. Please try again.');
        return;
      }
  
      // Success: Fetch hint details
      const hintDetails = await fetchLockedHintDetails(selectedHint);
      if (!hintDetails) return;
  
      setSelectedHint(hintDetails); // Set the selected hint to the full hint object
  
      // Update local state with the unlocked hint and remaining score
      setUsedHints((prevHints) => [...prevHints, hintDetails._id]); // Mark hint as used
      setShowHintDetails(true); // Show hint details
  
    } catch (error) {
      console.error('Error unlocking hint:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCodeChange = (code) => {
    setFormData({ ...formData, flag: code });
  };

  const handleSubmission = () => {
    if (challenge.type === 'code') {
      setAnswer(editorOutput);
    }
    handleSubmit();
  };

  const isSolved = solvedChallenges.includes(challenge._id);

  if (!isOpen) return null;

  const renderImage = (props) => (
    <img
      src={props.src}
      alt={props.alt}
      style={{
        maxWidth: '100%', // Ensures the image doesn't exceed the container width
        maxHeight: '320px', // Set max height as needed
        display: 'block',
        margin: '0 auto',
      }}
    />
  );

  // create individual containers
  const handleCreateContainer = async (challengeId) => {
    setIsCreating(true);  // Set loading state to true when starting the process
    setMessage('');  // Clear any previous messages

    try {
      const response = await fetch(`${apiUrl}/api/docker/create/container`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth-token': localStorage.getItem('Hactify-Auth-token')
        },
        body: JSON.stringify({ challengeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create container.');
      }

      setContainerData(data);  // Set the container data once created
      setMessage('Container created successfully.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Error creating container:', error);
    } finally {
      setIsCreating(false);  // Set loading state to false when the process is done
    }
  };

  // stop running container
  const handleDeleteContainer = async (containerId) => {
    try {
      const response = await fetch(`${apiUrl}/api/docker/stop/container`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ containerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop container.');
      }

      setMessage(`Container stopped successfully.`);
      setIsServerStopped(true);
      setContainerData({});
    } catch (error) {
      setMessage(`Error stopping container: ${error.message}`);
      console.error('Error stopping container:', error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mx-auto" style={headingFont}>{challenge.name}</h2>
          <button onClick={onClose} className="ml-4">&times;</button>
        </div>
        <p className="text-xl mr-8 mt-4 text-center" style={navbarFont}> Remaining Value: {updatedValue}</p>

        <div className="mt-4">
          <ReactMarkdown remarkPlugins={[gfm]} children={challenge.description} components={{ img: renderImage }} />
        </div>

        {isSolved ? (
          <div className="mt-4">
            <p className="text-green-500" style={paraFont}>This challenge has already been solved by you!</p>
          </div>
        ) : (attempts >= totalAttempts && totalAttempts !== 0) ? (
          <div className="mt-4">
            <p className="text-red-500" style={paraFont}>You are out of attempts!</p>
          </div>
        ) : (
          <>
            {challenge.type === 'multiple_choice' ? (
              <div className="mt-4">
                {challenge.choices.map((choice, index) => (
                  <div key={index} className="mt-2">
                    <input
                      type="radio"
                      id={`choice-${index}`}
                      name="choice"
                      value={choice}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <label htmlFor={`choice-${index}`} className="ml-2">
                      {choice}
                    </label>
                  </div>
                ))}
              </div>
            ) : challenge.type === 'standard' || challenge.type === 'manual_verification' || challenge.type === 'dynamic' ? (
              <div className="mt-4">
                {message && <p className={`${message.includes('Error') ? 'text-red-500' : 'text-green-500'} m-4`} style={paraFont}>{message}</p>}  {/* Display message if any */}
                {
                  challenge.type === 'dynamic' && challenge.dockerImage !== null ? (
                    <div className="flex flex-row">
                      {!containerData || !containerData.url ? (
                        // Show "Start server" button while container is not created or data is not available
                        <button
                          className="bg-green-500 rounded p-2 mb-2 text-white"
                          onClick={() => handleCreateContainer(challenge._id)}
                          disabled={isCreating}
                        >
                          {isCreating ? 'Creating container...' : 'Start server'}
                        </button>
                      ) : (
                        // Show "Stop server" button and flag link once container is created
                        <div className="flex flex-row">
                          <button
                            className="bg-red-500 rounded p-2 my-2 text-white"
                            onClick={() => handleDeleteContainer(containerData.containerId)}
                          >
                            Stop server
                          </button>
                          <div className="flex flex-col ml-4">
                            <p style={paraFont}>Use the link below to get the Flag:</p>
                            <a href={containerData.url} className="text-indigo-500" target="_blank" rel="noopener noreferrer">
                              Get Flag
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : ""
                }
                {challenge.type === 'dynamic' && challenge.dockerImage !== null ? (
                  isServerStopped ? (
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      style={paraFont}
                    ></textarea>
                  ) : (
                    <p className=''>Start the server to proceed</p>
                  )
                ) : (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    style={paraFont}
                  ></textarea>
                )}
              </div>
            ) : challenge.type === 'code' ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700" htmlFor="language">
                    Language:
                    <br />
                    <small className="form-text text-gray-500">
                      Write program to record Flag
                    </small>
                  </label>
                  <select
                    id="language"
                    name="language"
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                  </select>
                </div>
                <CodeEditor
                  language={formData.language}
                  onCodeChange={handleCodeChange}
                  setEditorOutput={setEditorOutput}
                  formData={formData}
                  setFormData={setFormData}
                />
              </>
            ) : null}

            {challenge.files && challenge.files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold" style={navbarFont}>Files:</h3>
                <ul className="list-disc list-inside mt-2">
                  {challenge.files.map((fileName, index) => (
                    <li key={index}>
                      <a
                        href={`${apiUrl}/uploads/CTFdChallenges/${fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        style={paraFont}
                      >
                        {fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">

              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
                onClick={fetchHints}
              >
                Hints
              </button>

              {totalAttempts !== 0 && (
                <span className='flex justify-center w-full' style={paraFont}>
                  {attempts}/{totalAttempts}
                </span>
              )}



              <span className="flex-grow"></span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                onClick={handleSubmission}
              >
                Submit
              </button>
            </div>
          </>
        )}

        {feedback && <p className="mt-4 text-center">{feedback}</p>}
        {editorOutput && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
            <h2 className="text-lg font-bold mb-2" style={navbarFont}>Output:</h2>
            <pre className="overflow-auto">{editorOutput}</pre>
          </div>
        )}
      </div>

      {hintsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mx-auto" style={navbarFont}>Hints</h2>
              <button onClick={() => setHintsModalOpen(false)} className="ml-4">&times;</button>
            </div>

            <ul className="mt-4">
              {hints.length > 0 ? (
                hints.map((hint, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        if (usedHints.includes(hint)) {
                          fetchHintDetails(hint);
                        } else {
                          costOfHint(hint);
                          setSelectedHint(hint);
                          setShowWarning(true);
                        }
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Hint {index + 1} 
                    </button>
                  </li>
                ))
              ) : (
                <p>No hints  available</p>
              )}
            </ul>


            {selectedHint && showHintDetails && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                <h3 className="text-lg font-bold" style={paraFont}>Hint Details:</h3>
                <p style={paraFont}>{selectedHint.content}</p>
                <p style={paraFont}>Cost: {selectedHint.cost}</p>
              </div>
            )}

            {selectedHint && showWarning && !usedHints.includes(selectedHint._id) && (
              <div className="mt-4 p-4 border border-yellow-500 rounded-lg bg-yellow-100">
                <p className="text-yellow-800" style={paraFont}>Unlocking this hint will deduct cost from your score {cost}. Proceed?</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2" onClick={confirmUnlockHint}>Proceed</button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowWarning(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;

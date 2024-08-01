
import React, { useState, useEffect } from 'react';
import CodeEditor from '../challenges/CodeEditor/CodeEditorFeild';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

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
  setUpdatedValue,
  solvedChallenges,

}) => {
  const [formData, setFormData] = useState({ language: 'python', flag: '' });
  const [editorOutput, setEditorOutput] = useState('');
  const [hintsModalOpen, setHintsModalOpen] = useState(false);
  const [hints, setHints] = useState([]);
  const [selectedHint, setSelectedHint] = useState(null);
  const [usedHints, setUsedHints] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showHintDetails, setShowHintDetails] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHintsModalOpen(false);
      setHints([]);
      setSelectedHint(null);
      setUsedHints([]);
    } else {
      fetchUserChallengeValue();

      fetchUsedHints();
    }
  }, [isOpen, challenge]);

  const fetchUserChallengeValue = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/hints/value/${challenge._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUpdatedValue(data.value);
    } catch (error) {
      console.error('Error fetching challenge value:', error);
    }
  };

  const fetchUsedHints = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/hints/used-hints/${challenge._id}`,{
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

  const fetchHints = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/challenges/hints/${challenge._id}`);
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

  

  const fetchHintDetails = async (hintId) => {
    try {
      const response = await fetch(`http://localhost:80/api/hints/hints/${hintId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
  
      if (data.length > 0) {
        console.log(data[0]);
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
      const response = await fetch(`http://localhost:80/api/hints/locked/hints/${hintId}`);
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
  
  
  
 

  const confirmUnlockHint = async () => {
    if (!selectedHint) return;
  
    setShowWarning(false);
  
    const hintDetails = await fetchLockedHintDetails(selectedHint); // Await for the hint details
    
    if (!hintDetails) return; // If no details are returned, exit the function
    
    setSelectedHint(hintDetails); // Set the selected hint to the full hint object
  
    if (!usedHints.includes(hintDetails._id)) { // Use hintDetails._id for the check
      setUsedHints(prevHints => [...prevHints, hintDetails._id]); // Use hintDetails._id
      setUpdatedValue(prevValue => prevValue - hintDetails.cost); // Use hintDetails.cost
      setShowHintDetails(true);
  
      try {
        await fetch(`http://localhost:80/api/hints/use-hint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          },
          body: JSON.stringify({
            challengeId: challenge._id,
            hintId: hintDetails._id, // Use hintDetails._id
          }),
        });
      } catch (error) {
        console.error('Error recording hint usage:', error);
      }
    } else {
      setShowHintDetails(true);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mx-auto">{challenge.name}</h2>
          <button onClick={onClose} className="ml-4">&times;</button>
        </div>
        <p className="text-xl mr-8 mt-4 text-center">Remaining Value: {updatedValue}</p>

        <div className="mt-4">
          <ReactMarkdown remarkPlugins={[gfm]} children={challenge.description} components={{ img: renderImage }}/>
        </div>

        {isSolved ? (
          <div className="mt-4">
            <p className="text-green-500">This challenge has already been solved by you!</p>
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
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                ></textarea>
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
                <h3 className="text-lg font-bold">Files:</h3>
                <ul className="list-disc list-inside mt-2">
                  {challenge.files.map((fileName, index) => (
                    <li key={index}>
                      <a
                        href={`http://localhost:80/uploads/${fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
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
            <h2 className="text-lg font-bold mb-2">Output:</h2>
            <pre className="overflow-auto">{editorOutput}</pre>
          </div>
        )}
      </div>

      {hintsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mx-auto">Hints</h2>
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
    <p>No hints available</p>
  )}
</ul>


            {selectedHint && showHintDetails && (
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                <h3 className="text-lg font-bold">Hint Details:</h3>
                <p>{selectedHint.content}</p>
                <p>Cost: {selectedHint.cost}</p>
              </div>
            )}

            {selectedHint && showWarning && !usedHints.includes(selectedHint._id) && (
              <div className="mt-4 p-4 border border-yellow-500 rounded-lg bg-yellow-100">
                <p className="text-yellow-800">Unlocking this hint will deduct cost from your score. Proceed?</p>
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

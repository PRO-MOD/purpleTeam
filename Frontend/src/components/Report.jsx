import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from './Challenges/challenges/Partials/InputFeild';
import ColorContext from '../context/ColorContext';
import FontContext from '../context/FontContext';

function Report() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const navigate = useNavigate();
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const { navbarFont, headingFont, paraFont } = useContext(FontContext);
  const { reportId } = useParams(); // Get the report ID from the URL
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch scenarios on mount
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/scenario/${reportId}`, {
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scenarios');
        }

        const data = await response.json();
        setScenarios(data);
        if (data.length > 0) {
          setSelectedScenario(""); // Set the first scenario as default
          setError("Select Scenario to submit")
        }
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        setError('Failed to fetch scenarios. Please try again.');
      }
    };

    fetchScenarios();
  }, [reportId, apiUrl]);

  // Fetch questions based on the selected scenario
  useEffect(() => {
    if (!selectedScenario) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${apiUrl}/api/questions/for/${reportId}/${selectedScenario}`, {
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'An unknown error occurred';
          setQuestions([]);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setQuestions(data);

        // Initialize formData with empty values for each question
        const initialFormData = data.reduce((acc, question) => {
          acc[question._id] = question.type === 'checkbox' || question.type === 'image' ? [] : '';
          return acc;
        }, {});
        setFormData(initialFormData);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedScenario, apiUrl]);

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (questionId, option) => {
    setFormData((prevData) => {
      const selectedOptions = prevData[questionId] || [];
      return {
        ...prevData,
        [questionId]: selectedOptions.includes(option)
          ? selectedOptions.filter((opt) => opt !== option)
          : [...selectedOptions, option],
      };
    });
  };

  const handleImageChange = (e, questionId) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      [questionId]: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const formDataToSend = new FormData();
      formDataToSend.append('reportId', reportId);
      formDataToSend.append('scenarioId', selectedScenario);

      Object.keys(formData).forEach((questionId) => {
        const value = formData[questionId];
        if (Array.isArray(value)) {
          value.forEach((file) => formDataToSend.append(`responses[${questionId}]`, file));
        } else {
          formDataToSend.append(`responses[${questionId}]`, value);
        }
      });

      const response = await fetch(`${apiUrl}/api/responses/ans`, {
        method: 'POST',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('Response submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl mb-8 text-center font-bold" style={{ color: textColor, fontFamily: headingFont }}>Report Form</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" style={{ fontFamily: paraFont }}>
          Select Scenario:
        </label>
        <select
          value={selectedScenario}
          onChange={handleScenarioChange}
          className="form-control outline-0 w-full p-2 border border-gray-300 rounded"
        >
        <option value="" disabled>
          Select the Scenario Id
        </option>
          {scenarios.map((scenario) => (
            <option key={scenario._id} value={scenario._id}>
              {scenario.scenarioId}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {loading && <div>Loading questions...</div>}
        {!loading && questions.map((question) => {
          switch (question.type) {
            case 'input':
              return (
                <InputField
                  key={question._id}
                  label={question.text}
                  type="text"
                  id={question._id}
                  name={question._id}
                  placeholder="Enter your answer"
                  value={formData[question._id] || ''}
                  onChange={handleInputChange}
                   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }} 
                />
              );
            case 'checkbox':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{question.text}:</label>
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option}
                        name={question._id}
                        checked={(formData[question._id] || []).includes(option)}
                        onChange={() => handleCheckboxChange(question._id, option)}
                      />
                      <label htmlFor={option} className="ml-2"   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{option}</label>
                    </div>
                  ))}
                </div>
              );
            case 'dropdown':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{question.text}:</label>
                  <select
                    id={question._id}
                    name={question._id}
                    value={formData[question._id] || ''}
                    onChange={handleInputChange}
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                     style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              );
            case 'textarea':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{question.text}:</label>
                  <textarea
                    id={question._id}
                    name={question._id}
                    value={formData[question._id] || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your answer"
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                     style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}
                  />
                </div>
              );
            case 'mcq':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700"   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{question.text}:</label>
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="radio"
                        id={option}
                        name={question._id}
                        value={option}
                        checked={formData[question._id] === option}
                        onChange={handleInputChange}
                      />
                      <label htmlFor={option} className="ml-2"   style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>{option}</label>
                    </div>
                  ))}
                </div>
              );
            case 'image':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700">{question.text}:</label>
                  <input
                    type="file"
                    id={question._id}
                    name={question._id}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(e, question._id)}
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        <button type="submit" className={`w-full  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${error ? "hidden" : ""}`} disabled={loading || error} style={{backgroundColor: sidenavColor, fontFamily: navbarFont}}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default Report;

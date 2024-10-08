


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from './Challenges/challenges/Partials/InputFeild';
import ColorContext from '../context/ColorContext';

// Ensure this component is updated to handle different input types

function Report() {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const navigate = useNavigate();
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
  const { reportId } = useParams(); // Get the report ID from the URL
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${apiUrl}/api/questions/for/${reportId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setQuestions(data);

        // Initialize formData with empty values for each question
        const initialFormData = data.reduce((acc, question) => {
          if (question.type === 'checkbox' || question.type === 'image') {
            acc[question._id] = [];
          } else {
            acc[question._id] = '';
          }
          return acc;
        }, {});
        setFormData(initialFormData);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [reportId, apiUrl]);

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
      if (selectedOptions.includes(option)) {
        return {
          ...prevData,
          [questionId]: selectedOptions.filter((opt) => opt !== option),
        };
      } else {
        return {
          ...prevData,
          [questionId]: [...selectedOptions, option],
        };
      }
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

      Object.keys(formData).forEach(questionId => {
        const value = formData[questionId];
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formDataToSend.append(`responses[${questionId}]`, file);
          });
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
        alert(response.statusText);
        throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
        
      }

      console.log('Form submitted successfully');
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
      <h2 className="text-3xl mb-8 text-center font-bold " style={{color:textColor}}>Report Form</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
                />
              );
            case 'checkbox':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700">{question.text}:</label>
                  {question.options.map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option}
                        name={question._id}
                        checked={(formData[question._id] || []).includes(option)}
                        onChange={() => handleCheckboxChange(question._id, option)}
                      />
                      <label htmlFor={option} className="ml-2">{option}</label>
                    </div>
                  ))}
                </div>
              );
            case 'dropdown':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700">{question.text}:</label>
                  <select
                    id={question._id}
                    name={question._id}
                    value={formData[question._id] || ''}
                    onChange={handleInputChange}
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
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
                  <label className="block text-gray-700">{question.text}:</label>
                  <textarea
                    id={question._id}
                    name={question._id}
                    value={formData[question._id] || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your answer"
                    className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                  />
                </div>
              );
            case 'mcq':
              return (
                <div key={question._id}>
                  <label className="block text-gray-700">{question.text}:</label>
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
                      <label htmlFor={option} className="ml-2">{option}</label>
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
        <button type="submit" className="w-full  text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading} style={{backgroundColor: sidenavColor}}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default Report;

import React, { useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ChallengeModal from './Partials/ChallengeModal';

const CreateChallengeForm = ({ selectedOption }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        value: '',
        type: selectedOption,
    });

    useEffect(() => {
        setFormData({ ...formData, type: selectedOption });
    }, [selectedOption]);

    const [showModal, setShowModal] = useState(false);
    const [challengeId, setChallengeId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDescriptionChange = (value) => {
        setFormData({ ...formData, description: value });
    };

    const apiUrl = import.meta.env.VITE_Backend_URL;
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${apiUrl}/api/challenges/create`; // Replace with your actual backend endpoint

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Challenge created:', data);

            setShowModal(true);
            setChallengeId(data.challengeId);

            setFormData({
                name: '',
                category: '',
                description: '',
                value: '',
                type: selectedOption,
            });

        } catch (error) {
            console.error('Error creating challenge:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="col-md-7 ms-8 me-24">
            <div id="create-chal-entry-div">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-group">
                        <label className="block text-gray-700" htmlFor='name'>
                            Name:
                            <br />
                            <small className="form-text text-gray-500">
                                The name of your challenge
                            </small>
                        </label>
                        <input
                            type="text"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            id='name'
                            name="name"
                            placeholder="Enter challenge name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-700" htmlFor="category">
                            Category:
                            <br />
                            <small className="form-text text-gray-500">
                                The category of your challenge
                            </small>
                        </label>
                        <input
                            type="text"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            id="category"
                            name="category"
                            placeholder="Enter challenge category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-700">
                            Message:
                            <br />
                            <small className="form-text text-gray-500">
                                Use this to give a brief introduction to your challenge.
                            </small>
                        </label>
                        <SimpleMDE
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-700" htmlFor='value'>
                            Value:
                            <br />
                            <small className="form-text text-gray-500">
                                This is how many points are rewarded for solving this challenge.
                            </small>
                        </label>
                        <input
                            type="number"
                            className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                            id="value"
                            name="value"
                            placeholder="Enter value"
                            value={formData.value}
                            onChange={handleChange}
                        />
                    </div>

                    <input type="hidden" name="state" value="hidden" />

                    <div className="form-group">
                        <button
                            className="btn btn-primary float-right bg-blue-500 text-white py-2 px-4 rounded"
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {showModal && <ChallengeModal challengeId={challengeId} selectedOption={selectedOption} closeModal={closeModal} />}
        </div>
    );
};

export default CreateChallengeForm;

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddQuestion from './AddQuestion'; // Ensure this path is correct

const Questions = ({ reportId }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:80/api/questions/for/${reportId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setError('Failed to load questions');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [reportId]);

    const handleEdit = (id) => {
        // Handle edit logic here
        console.log('Edit question with ID:', id);
    };

    const handleDelete = async (id) => {
        // Handle delete logic here
        try {
            const response = await fetch(`http://localhost:80/api/questions/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete question');
            }
            // Remove deleted question from state
            setQuestions(questions.filter((question) => question._id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
            setError('Failed to delete question');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-6">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold">Questions</h2>
                <FontAwesomeIcon icon={faPlus} className="mx-2 text-green-500" onClick={() => setShowModal(true)}/>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Question
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Options
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {questions.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-gray-700 text-center">
                                No Questions Available
                            </td>
                        </tr>
                    ) : (
                        questions.map((question) => (
                            <tr key={question._id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <pre className="text-gray-700">{question.text}</pre>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    <span>{question.type}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {!(question.type === 'input' || question.type === 'textarea') && question.options ? (
                                        <ul className="list-disc list-inside text-gray-700">
                                            {question.options.map((option, index) => (
                                                <p key={index}>{option}</p>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No options</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                                    <div className="flex justify-end space-x-2">
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => handleEdit(question._id)}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => handleDelete(question._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <AddQuestion
                            onClose={() => setShowModal(false)}
                            reportId={reportId}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Questions;

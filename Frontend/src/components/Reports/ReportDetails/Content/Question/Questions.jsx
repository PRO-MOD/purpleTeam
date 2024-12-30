import React, { useEffect, useState, useContext } from 'react';
import Table from '../../../Table'; // Import the reusable Table component
import AddQuestion from './AddQuestion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../context/FontContext';

const Questions = ({ reportId }) => {
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const apiUrl = import.meta.env.VITE_Backend_URL;

    useEffect(() => {
        fetchQuestions();
    }, [reportId]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/questions/for/${reportId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            setQuestions(data.sort((a, b) => a.index - b.index));
        } catch (error) {
            setError('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/questions/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete question');
            }
            setQuestions(questions.filter((question) => question._id !== id));
        } catch (error) {
            setError('Failed to delete question');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingQuestion(null);
    };

    const handleQuestionSubmit = async (newQuestion)  => {
        if (editingQuestion) {
            setQuestions(questions.map((question) =>
                question._id === newQuestion._id ? newQuestion : question
            ));
            await fetchQuestions();
        } else {
            setQuestions([...questions, newQuestion].sort((a, b) => a.index - b.index));
            await fetchQuestions();
        }
        handleModalClose();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const columns = [
        { header: "Order", accessor: "index" },
        { header: "Scenario ID", accessor: "scenarioName" },
        { header: "Question", accessor: "text" },
        { header: "Type", accessor: "type" },
        { header: "Options", accessor: "options" },
        { header: "Max Score", accessor: "maxScore" },
    ];

    return (
        <div className="container mx-auto px-6">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold"style={{fontFamily: headingFont}}>Questions</h2>
                <FontAwesomeIcon icon={faPlus} className="mx-2 text-green-500 cursor-pointer" onClick={() => setShowModal(true)} />
            </div>
            <Table columns={columns} data={questions} onEdit={handleEdit} onDelete={handleDelete} editButtonReq={true}/>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <AddQuestion
                            onClose={handleModalClose}
                            reportId={reportId}
                            existingQuestion={editingQuestion}
                            onSubmit={handleQuestionSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Questions;

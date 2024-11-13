import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';

const Tags = ({ challengeId }) => {
    const { paraFont, headingFont, navbarFont } = useContext(FontContext); // Destructure fonts from FontContext

    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [message, setMessage] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTags();
    }, [challengeId]);

    const apiUrl = import.meta.env.VITE_Backend_URL;

    const fetchTags = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/tags/get/${challengeId}`);
            const data = await response.json();
            setTags(data.tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleAddTag = async () => {
        if (!newTag.trim()) {
            setMessage('Please enter a tag.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/tags/add/${challengeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tag: newTag.trim() }),
            });

            if (!response.ok) {
                throw new Error('Tag addition failed.');
            }

            const data = await response.json();
            setTags((prevTags) => [...prevTags, data.tag]);
            setNewTag('');
            setIsAdding(false);
            setMessage('Tag added successfully');
        } catch (error) {
            setMessage('Tag addition failed.');
            console.error('Error adding tag:', error);
        }
    };

    const handleDeleteTag = async (tag) => {
        try {
            const response = await fetch(`${apiUrl}/api/tags/${challengeId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tag }),
            });

            if (!response.ok) {
                throw new Error('Tag deletion failed.');
            }

            setTags((prevTags) => prevTags.filter((t) => t !== tag));
            setMessage('Tag deleted successfully');
        } catch (error) {
            setMessage('Tag deletion failed.');
            console.error('Error deleting tag:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-4 mx-12">
                <div className="flex flex-row items-center mb-2">
                    <h3 className={`font-medium text-xl ${headingFont}`}>Tags</h3>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="text-blue-500 cursor-pointer mx-2"
                        onClick={() => setIsAdding(!isAdding)}
                        title="Add Tag"
                    />
                </div>
                {tags.length === 0 ? (
                    <p className={paraFont}>No tags added.</p>
                ) : (
                    <ul className="list-disc pl-5 flex flex-row flex-wrap">
                        {tags.map((tag, index) => (
                            <li key={index} className={`flex items-center p-2 rounded-lg mb-2 ${paraFont}`}>
                                <span className="mr-2 px-2 bg-gray-200">
                                    {tag}
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className="text-red-500 cursor-pointer ms-2"
                                        onClick={() => handleDeleteTag(tag)}
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                {isAdding && (
                    <div className="mt-4">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag"
                            className={`border border-gray-300 p-2 rounded-sm w-full mb-2 ${paraFont}`}
                        />
                        <button
                            onClick={handleAddTag}
                            className={`bg-blue-500 text-white p-2 rounded-sm ${navbarFont}`}
                        >
                            Add Tag
                        </button>
                    </div>
                )}
                {message && <p className={`mt-4 ${paraFont}`}>{message}</p>}
            </div>
        </div>
    );
};

export default Tags;


import React, { useState, useEffect } from 'react';
import CodeEditor from '../CodeEditor/CodeEditorFeild';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const ChallengeModal = ({ challengeId, selectedOption, closeModal }) => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [formData, setFormData] = useState({
        flag: [],
        flag_data: [],
        file: [],
        state: 'hidden',
        language: 'python',
        choices: [''],
        code: '',
        user_ids: []

    });

    const [editorOutput, setEditorOutput] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


    useEffect(() => {
        // Fetch user data from the API
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/user/getallusers`);
                const data = await response.json();
                const userOptions = data.map(user => ({ value: user._id, label: user.name }));
                setUsers([{ value: 'select-all', label: 'Select All' }, ...userOptions]);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [apiUrl]);

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, [e.target.name]: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleChoiceChange = (index, event) => {
        const newChoices = formData.choices.slice();
        newChoices[index] = event.target.value;
        setFormData({ ...formData, choices: newChoices });
    };

    const addChoice = () => {
        setFormData({ ...formData, choices: [...formData.choices, ''] });
    };

    const removeChoice = (index) => {
        const newChoices = formData.choices.filter((_, i) => i !== index);
        setFormData({ ...formData, choices: newChoices });
    };

    const handleCodeChange = (code) => {
        setFormData({ ...formData, code });
    };


    const handleUserSelect = (selectedOptions) => {
        if (selectedOptions && selectedOptions.some(option => option.value === 'select-all')) {
            if (selectAll) {
                setFormData({ ...formData, user_ids: [] });
                setSelectAll(false);
            } else {
                setFormData({
                    ...formData,
                    user_ids: users.filter(user => user.value !== 'select-all').map(user => user.value)
                });
                setSelectAll(true);
            }
        } else {
            setFormData({
                ...formData,
                user_ids: selectedOptions ? selectedOptions.map(option => option.value) : []
            });
            setSelectAll(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('flag', selectedOption === 'code' ? editorOutput.trim() : formData.flag);
        formDataToSend.append('flag_data', formData.flag_data);
        formDataToSend.append('state', formData.state);
        formDataToSend.append('user_ids', JSON.stringify(formData.user_ids));


        if (selectedOption === 'code') {
            formDataToSend.append('language', formData.language);
            formDataToSend.append('code', formData.code);
        } else if (selectedOption === 'multiple_choice') {
            formDataToSend.append('choices', JSON.stringify(formData.choices));
        }

        if (formData.file.length > 0) {
            for (let i = 0; i < formData.file.length; i++) {
                formDataToSend.append('file', formData.file[i]);
            }
        }

        try {
            const response = await fetch(`${apiUrl}/api/challenges/update/${challengeId}`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Challenge updated successfully');
            closeModal();
        } catch (error) {
            console.error('Error updating challenge:', error);
            setError('Error updating challenge. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-dialog modal-lg w-2/3 h-2/3">
                <div className="modal-content bg-white shadow-lg rounded-lg h-full overflow-y-scroll">
                    <div className="modal-header bg-gray-100 border-b p-4 rounded-t-lg flex flex-row justify-between items-center">
                        <h5 className="modal-title text-xl font-semibold">Challenge Options</h5>
                        <button type="button" className="close text-gray-500" onClick={closeModal}>
                            <span className='text-2xl'>×</span>
                        </button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {selectedOption === 'code' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700" htmlFor='language'>
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
                            )}



                            {error && (
                                <div className="mt-4 p-4 border border-red-500 rounded-lg bg-white">
                                    <h2 className="text-lg font-bold mb-2 text-red-500">Error:</h2>
                                    <pre className="overflow-auto text-red-500">{error}</pre>
                                </div>
                            )}

                            {editorOutput && (
                                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                                    <h2 className="text-lg font-bold mb-2">Output:</h2>
                                    <pre className="overflow-auto">{editorOutput}</pre>
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="flag" className="block text-sm font-medium text-gray-700">
                                    Flag:
                                    <small className="text-gray-500 block">Static flag for your challenge</small>
                                </label>
                                <textarea
                                    id="flag"
                                    name="flag"
                                    type="text"
                                    placeholder='Enter your flag'
                                    className="form-input block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2 resize-none size-fit"
                                    value={formData.flag}
                                    disabled={selectedOption === 'code'}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4 flex">
                                <div className="w-3/4 mr-2">
                                    <label htmlFor="flag_data" className="block text-sm font-medium text-gray-700">
                                        Flag Data:
                                    </label>
                                    <select
                                        id="flag_data"
                                        name="flag_data"
                                        className="form-select mt-1 block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                                        value={formData.flag_data}
                                        onChange={handleChange}
                                    >
                                        <option value="case_sensitive">Case Sensitive</option>
                                        <option value="case_insensitive">Case Insensitive</option>
                                    </select>
                                </div>
                                <div className="w-1/4">
                                    <input type="hidden" name="flag_type" value="static" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                    Files:
                                    <small className="text-gray-500 block">Files distributed along with your challenge</small>
                                </label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    className="form-input block w-full sm:text-sm border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0"
                                    multiple
                                    onChange={handleChange}
                                />
                                <sub className="text-muted">Attach multiple files using Control+Click or Cmd+Click</sub>
                            </div>

                            {selectedOption === 'multiple_choice' && (
                                <div className="form-group">
                                    <div className='flex flex-row'>
                                    <label className="block text-gray-700">
                                        Choices:
                                    </label>
                                    <button
                                        type="button"
                                        className="mx-2 text-2xl"
                                        onClick={addChoice}
                                    >
                                        <FontAwesomeIcon icon={faCirclePlus}/>
                                    </button>
                                    </div>
                                    {formData.choices.map((choice, index) => (
                                        <div key={index} className="flex mb-2">
                                            <input
                                                type="text"
                                                className="form-input block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                                                value={choice}
                                                placeholder={`Choice ${index+1}`}
                                                onChange={(e) => handleChoiceChange(index, e)}
                                            />
                                            <button
                                                type="button"
                                                className="m-2 text-3xl"
                                                onClick={() => removeChoice(index)}
                                            >
                                                <FontAwesomeIcon icon={faCircleMinus}/>
                                            </button>
                                        </div>
                                    ))}
                                    
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                    State:
                                    <small className="text-gray-500 block">Should the challenge be visible to users</small>
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    className="form-select mt-1 block w-full sm:text-sm border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 border p-2"
                                    value={formData.state}
                                    onChange={handleChange}
                                >
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>


                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Assign to Users:
                                </label>
                                <Select
                                    isMulti
                                    options={users}
                                    value={users.filter(user => formData.user_ids.includes(user.value))}
                                    onChange={handleUserSelect}
                                    className="mt-1 block w-full sm:text-sm border border-gray-300 rounded-sm"
                                />
                            </div>


                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="ml-2 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeModal;




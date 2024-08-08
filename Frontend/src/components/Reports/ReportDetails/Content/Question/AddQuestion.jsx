import React, { useState } from "react";
import InputField from "../../../../Challenges/challenges/Partials/InputFeild";

const AddQuestion = ({ reportId, onClose }) => {
    const [text, setText] = useState("");
    const [type, setType] = useState("input");
    const [options, setOptions] = useState("");
    const [index, setIndex] = useState(0);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const questionData = {
            text,
            type,
            options: options.split(",").map((option) => option.trim()), // Split options into an array
            index,
        };

        try {
            const response = await fetch(`http://localhost/api/questions/add/${reportId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(questionData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Question created successfully: ${data.text}`);
                // Clear form fields
                setText("");
                setType("input");
                setOptions("");
                setIndex(0);
                if (onClose) onClose(); // Close the modal after successful addition
            } else {
                setMessage("Failed to create question");
            }
        } catch (error) {
            console.error("Error creating question:", error);
            setMessage("Error creating question");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Add New Question</h2>
            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Question Text"
                    required
                />
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    >
                        <option value="input">Input</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="textarea">Textarea</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="mcq">MCQ</option>
                    </select>
                </div>
                {(type === "dropdown" || type === "checkbox" || type === "mcq") && (
                    <InputField
                        type="text"
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        label="Options (comma separated)"
                    />
                )}
                <InputField
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(parseInt(e.target.value, 10))}
                    label="Index"
                    required
                />
                <div className="flex flex-row mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Question
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mx-2 text-gray-800"
                    >
                        CLOSE
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
};

export default AddQuestion;

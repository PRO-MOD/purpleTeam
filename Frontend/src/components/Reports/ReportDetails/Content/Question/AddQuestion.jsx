import React, { useState, useEffect, useContext } from "react";
import InputField from "../../../../Challenges/challenges/Partials/InputFeild";
import FontContext from "../../../../../context/FontContext";

const AddQuestion = ({ reportId, onClose, existingQuestion, onSubmit }) => {
    const { navbarFont, headingFont, paraFont } = useContext(FontContext);
    const [text, setText] = useState(existingQuestion ? existingQuestion.text : "");
    const [type, setType] = useState(existingQuestion ? existingQuestion.type : "input");
    const [options, setOptions] = useState(existingQuestion ? existingQuestion.options.join(", ") : "");
    const [index, setIndex] = useState(existingQuestion ? existingQuestion.index : 0);
    const [maxScore, setMaxScore] = useState(existingQuestion ? existingQuestion.maxScore : 0);
    const [scenarioId, setScenarioId] = useState(existingQuestion ? existingQuestion.scenarioId : "");
    const [availableScenarios, setAvailableScenarios] = useState([]);
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_Backend_URL;

    useEffect(() => {
        if (existingQuestion) {
            setText(existingQuestion.text);
            setType(existingQuestion.type);
            setOptions(existingQuestion.options.join(", "));
            setIndex(existingQuestion.index);
            setMaxScore(existingQuestion.maxScore);
            setScenarioId(existingQuestion.scenarioId._id);
        }
    }, [existingQuestion]);

    // Fetch scenarios for the reportId
    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/scenario/${reportId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch scenarios");
                }
                const data = await response.json();
                setAvailableScenarios(data); // Assuming data contains an array of scenarios
            } catch (error) {
                console.error("Error fetching scenarios:", error);
            }
        };

        fetchScenarios();
    }, [reportId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const questionData = {
            _id: existingQuestion ? existingQuestion._id : undefined,
            text,
            type,
            options: options.split(",").map((option) => option.trim()), // Split options into an array
            index,
            maxScore,
            report: reportId, // Ensure report ID is included
            scenarioId, // Include scenarioId from the input field
        };

        try {
            const method = existingQuestion ? "PUT" : "POST";
            const url = existingQuestion
                ? `${apiUrl}/api/questions/edit/${existingQuestion._id}`
                : `${apiUrl}/api/questions/add/${reportId}`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(questionData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Question ${existingQuestion ? "updated" : "created"} successfully: ${data.text}`);
                onSubmit(data);
                // Clear form fields if adding a new question
                if (!existingQuestion) {
                    setText("");
                    setType("input");
                    setOptions("");
                    setIndex(0);
                    setMaxScore(0);
                    setScenarioId("");
                }
            } else {
                setMessage(`Failed to ${existingQuestion ? "update" : "create"} question`);
            }
        } catch (error) {
            console.error(`Error ${existingQuestion ? "updating" : "creating"} question:`, error);
            setMessage(`Error: Failed to ${existingQuestion ? "update" : "create"} question`);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: headingFont }}>
                {existingQuestion ? "Edit" : "Add"} Question
            </h3>
            {message && <div className="text-green-500 mt-2">{message}</div>}
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Scenario ID Dropdown */}
                <div className="mb-4">
                    <label htmlFor="scenarioId" className="block text-sm font-medium text-gray-700" style={{ fontFamily: paraFont }}>
                        Scenario ID
                    </label>
                    <select
                        id="scenarioId"
                        value={scenarioId}
                        onChange={(e) => setScenarioId(e.target.value)}
                        className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                        style={{ fontFamily: paraFont }}
                        required
                    >
                        <option value="">Select Scenario</option>
                        {availableScenarios.map((scenario) => (
                            <option key={scenario._id} value={scenario._id}>
                                {scenario.scenarioId} {/* Assuming scenario has 'scenarioId' field */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rest of the fields */}
                <InputField
                    label="Question in Report"
                    type="text"
                    description="Enter the question to be displayed to the user"
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700" style={{ fontFamily: paraFont }}>
                        Type
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                        style={{ fontFamily: paraFont }}
                    >
                        <option value="input">Input</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="textarea">Textarea</option>
                        <option value="mcq">Multiple Choice</option>
                        <option value="image">Image</option>
                    </select>
                </div>
                <InputField
                    label="Options"
                    description="(comma-separated)"
                    type="text"
                    id="options"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    disabled={type === "input" || type === "textarea"}
                />
                <InputField
                    label="Index"
                    type="number"
                    id="index"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    required
                />
                <InputField
                    label="Max Score"
                    type="number"
                    id="maxScore"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                />
                <div className="flex justify-end space-x-4 mt-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 hover:text-red-500"
                        style={{ fontFamily: navbarFont }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                        style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
                    >
                        {existingQuestion ? "Update" : "Add"} Question
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddQuestion;

// CodeEditor.jsx
import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, onCodeChange, setEditorOutput, formData, setFormData }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with a default code template based on language
        switch (language) {
            case 'python':
                setCode('# Write your Python code here\nprint("Hello, World!")');
                break;
            case 'javascript':
                setCode('// Write your JavaScript code here\nconsole.log("Hello, World!");');
                break;
            case 'java':
                setCode(`public class Main {
    public static void main(String[] args) {
        // Write your Java code here
    }
}`);
                break;
            default:
                setCode('');
        }
    }, [language]);

    const apiUrl = import.meta.env.VITE_Backend_URL;

    const runCode = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/executecode/runcode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language, code }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Error running code. Please try again.');
                setFormData({ ...formData, flag: '' });
                setEditorOutput('');
            } else {
                setEditorOutput(data.output);
                setFormData({ ...formData, flag: data.output });
                setError('');
            }
        } catch (err) {
            console.error('Error running code:', err);
            setError('Error running code. Please try again.');
            setEditorOutput('');
        }
    };

    const handleEditorChange = (newValue) => {
        setCode(newValue);
        onCodeChange(newValue);
    };

    return (
        <div className="w-full flex flex-col justify-center">
            <Editor
                width="100%"
                height="200px"
                language={language}
                theme="vs-light"
                value={code}
                onChange={handleEditorChange}
                options={{ automaticLayout: true }}
            />
            <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded mt-2 w-2/4 p-1 mx-auto"
                onClick={runCode}
                type='button'
            >
                Run & Record Flag
            </button>
            {error && (
                <div className="mt-4 p-4 border border-red-500 rounded-lg bg-white">
                    <h2 className="text-lg font-bold mb-2 text-red-500">Error:</h2>
                    <pre className="overflow-auto text-red-500">{error}</pre>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;

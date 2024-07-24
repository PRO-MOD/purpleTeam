

// import React, { useState } from 'react';
// import CodeEditor from '../challenges/CodeEditor/CodeEditorFeild';
// import SimpleMDE from 'react-simplemde-editor';
// import 'easymde/dist/easymde.min.css';
// import ReactMarkdown from 'react-markdown';
// import gfm from 'remark-gfm';

// const Modal = ({
//   isOpen,
//   onClose,
//   challenge,
//   answer,
//   setAnswer,
//   handleSubmit,
//   attempts,
//   feedback
// }) => {
//   const [formData, setFormData] = useState({ language: 'python', flag: '' });
//   const [editorOutput, setEditorOutput] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCodeChange = (code) => {
//     setFormData({ ...formData, flag: code });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold mx-auto">{challenge.name}</h2>
//           <button onClick={onClose} className="ml-4">&times;</button>
//         </div>
//         <p className="text-xl mr-8 mt-4 text-center">{challenge.value}</p>
//         <div className="mt-4">
//           <ReactMarkdown remarkPlugins={[gfm]} children={challenge.description} />
//         </div>

//         {challenge.type === 'multiple_choice' ? (
//           <div className="mt-4">
//             {challenge.choices.map((choice, index) => (
//               <div key={index} className="mt-2">
//                 <input
//                   type="radio"
//                   id={`choice-${index}`}
//                   name="choice"
//                   value={choice}
//                   onChange={(e) => setAnswer(e.target.value)}
//                 />
//                 <label htmlFor={`choice-${index}`} className="ml-2">
//                   {choice}
//                 </label>
//               </div>
//             ))}
//           </div>
//         ) : challenge.type === 'standard' || challenge.type === 'manual_verification' ? (
//           <div className="mt-4">
//             <textarea
//               className="w-full p-2 border border-gray-300 rounded"
//               rows="3"
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//             ></textarea>
//           </div>
//         ) : challenge.type === 'code' ? (
//           <>
//             <div className="mb-4">
//               <label className="block text-gray-700" htmlFor="language">
//                 Language:
//                 <br />
//                 <small className="form-text text-gray-500">
//                   Write program to record Flag
//                 </small>
//               </label>
//               <select
//                 id="language"
//                 name="language"
//                 className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
//                 value={formData.language}
//                 onChange={handleChange}
//               >
//                 <option value="python">Python</option>
//                 <option value="javascript">JavaScript</option>
//                 <option value="java">Java</option>
//               </select>
//             </div>
//             <CodeEditor
//               language={formData.language}
//               onCodeChange={handleCodeChange}
//               setEditorOutput={setEditorOutput}
//               formData={formData}
//               setFormData={setFormData}
//             />
//           </>
//         ) : null}

//         <div className="mt-4 flex justify-between items-center">
//           <span>{attempts}/3 attempts</span>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>

//         {feedback && <p className="mt-4 text-center">{feedback}</p>}
//         {editorOutput && (
//           <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
//             <h2 className="text-lg font-bold mb-2">Output:</h2>
//             <pre className="overflow-auto">{editorOutput}</pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React, { useState } from 'react';
import CodeEditor from '../challenges/CodeEditor/CodeEditorFeild';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
const apiUrl = import.meta.env.VITE_Backend_URL;

const Modal = ({
  isOpen,
  onClose,
  challenge,
  answer,
  setAnswer,
  handleSubmit,
  attempts,
  feedback
}) => {
  const [formData, setFormData] = useState({ language: 'python', flag: '' });
  const [editorOutput, setEditorOutput] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCodeChange = (code) => {
    setFormData({ ...formData, flag: code });
  };

  const handleSubmission = () => {
    if (challenge.type === 'code') {
      // If challenge type is 'code', submit the editor output as the answer
      setAnswer(editorOutput);
    }
    handleSubmit(); // Call the handleSubmit function passed as prop
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full w-full md:max-w-3xl overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mx-auto">{challenge.name}</h2>
          <button onClick={onClose} className="ml-4">&times;</button>
        </div>
        <p className="text-xl mr-8 mt-4 text-center">{challenge.value}</p>
        <div className="mt-4">
          <ReactMarkdown remarkPlugins={[gfm]} children={challenge.description} />
        </div>

        {challenge.type === 'multiple_choice' ? (
          <div className="mt-4">
            {challenge.choices.map((choice, index) => (
              <div key={index} className="mt-2">
                <input
                  type="radio"
                  id={`choice-${index}`}
                  name="choice"
                  value={choice}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <label htmlFor={`choice-${index}`} className="ml-2">
                  {choice}
                </label>
              </div>
            ))}
          </div>
        ) : challenge.type === 'standard' || challenge.type === 'manual_verification' ? (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
          </div>
        ) : challenge.type === 'code' ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="language">
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
        ) : null}
{challenge.files && challenge.files.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-bold">Files:</h3>
    <ul className="list-disc list-inside mt-2">
      {challenge.files.map((fileName, index) => (
        <li key={index}>
          <a
            href={`${apiUrl}/uploads/${fileName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {fileName}  {/* Display file name */}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}



        <div className="mt-4 flex justify-between items-center">
          <span>{attempts}/3 attempts</span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmission}
          >
            Submit
          </button>
        </div>

        {feedback && <p className="mt-4 text-center">{feedback}</p>}
        {editorOutput && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
            <h2 className="text-lg font-bold mb-2">Output:</h2>
            <pre className="overflow-auto">{editorOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;


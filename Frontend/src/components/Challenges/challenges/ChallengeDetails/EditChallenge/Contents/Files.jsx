import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';

const Files = ({ challengeId }) => {
  const { headingFont, paraFont } = useContext(FontContext); // Import font context
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/files/${challengeId}`, {
          method: 'GET',
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          }
        });
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [challengeId]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const response = await fetch(`${apiUrl}/api/challenges/files/${challengeId}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        }
      });

      if (!response.ok) {
        throw new Error('File upload failed.');
      }

      const data = await response.json();
      setFiles((prevFiles) => [...prevFiles, data.filename]);
      setMessage('File uploaded successfully');
      setShowUpload(false);
    } catch (error) {
      setMessage('File upload failed.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleFileDelete = async (filename) => {
    try {
      const response = await fetch(`${apiUrl}/api/challenges/files/${challengeId}/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        }
      });

      if (!response.ok) {
        throw new Error('File delete failed.');
      }

      setFiles((prevFiles) => prevFiles.filter((file) => file !== filename));
      setMessage('File deleted successfully');
    } catch (error) {
      setMessage('File delete failed.');
      console.error('Error deleting file:', error);
    }
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold text-center"
            style={{ ...headingFont }} // Apply heading font style
          >
            Files
          </h2>
          <FontAwesomeIcon icon={faFileUpload} className="text-blue-500 cursor-pointer" onClick={toggleUpload} />
        </div>
        {files.length === 0 ? (
          <p style={{ ...paraFont }}>No files uploaded.</p> // Apply paragraph font style
        ) : (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                <a
                  href={`${apiUrl}/uploads/CTFdChallenges/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                  style={{ ...paraFont }} // Apply paragraph font style
                >
                  {file}
                </a>
                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleFileDelete(file)} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="max-w-lg mx-auto">
        {showUpload && (
          <div className="flex flex-col justify-end">
            <div className="flex flex-col">
              <input type="file" onChange={handleFileChange} className="" />
              <small style={{ ...paraFont }}>Attach multiple files using Control+Click or Cmd+Click.</small>
            </div>
            <button
              onClick={handleFileUpload}
              className="bg-green-600 text-white p-2 mt-4 rounded-sm w-1/4 ms-auto"
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p className="mt-4" style={{ ...paraFont }}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;

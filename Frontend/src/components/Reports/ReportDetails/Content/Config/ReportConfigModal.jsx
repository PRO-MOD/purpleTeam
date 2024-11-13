import React, { useState, useEffect, useContext } from 'react';
import InputField from '../../../../Challenges/challenges/Partials/InputFeild';
import FontContext from '../../../../../context/FontContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';


const ReportConfigModal = ({ reportId }) => {
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const [showModal, setShowModal] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [footers, setFooters] = useState([]);
  const [headerId, setHeaderId] = useState('');
  const [footerId, setFooterId] = useState('');
  const [firstPageInfo, setFirstPageInfo] = useState([{ text: '', margin: 0, coordinateY: 0 }]);
  const [lastPageInfo, setLastPageInfo] = useState([{ text: '', margin: 0, coordinateY: 0 }]);
  const [enablePageNumber, setEnablePageNumber] = useState(false);
  const [message, setMessage] = useState('');
  const apiUrl = import.meta.env.VITE_Backend_URL;
  

  useEffect(() => {
    const fetchHeadersAndFooters = async () => {
      try {
        const [headerResponse, footerResponse] = await Promise.all([
          fetch(`${apiUrl}/api/reports/headers`),
          fetch(`${apiUrl}/api/reports/footers`)
        ]);

        const headers = await headerResponse.json();
        const footers = await footerResponse.json();

        setHeaders(headers);
        setFooters(footers);
      } catch (error) {
        console.error('Error fetching headers and footers:', error);
        setMessage('Error fetching headers and footers.');
      }
    };

    fetchHeadersAndFooters();
  }, []);

  const handleFirstPageChange = (index, field, value) => {
    const updatedFirstPageInfo = [...firstPageInfo];
    updatedFirstPageInfo[index][field] = value;
    setFirstPageInfo(updatedFirstPageInfo);
  };

  const handleLastPageChange = (index, field, value) => {
    const updatedLastPageInfo = [...lastPageInfo];
    updatedLastPageInfo[index][field] = value;
    setLastPageInfo(updatedLastPageInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const configData = {
      headerId,
      footerId,
      firstPage: firstPageInfo,
      lastPage: lastPageInfo,
      enablePageNumber,
    };

    try {
      const response = await fetch(`${apiUrl}/api/reportConfig/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });

      if (response.ok) {
        setMessage('Configuration updated successfully.');
        setShowModal(false);
      } else {
        setMessage('Failed to update configuration.');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      setMessage('Error updating configuration.');
    }
  };

  return (
    <div className="">
      <FontAwesomeIcon className='mx-2 text-blue-500 cursor-pointer' icon={faGears} title='Configure Report' onClick={() => setShowModal(true)}/>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80%] overflow-y-scroll">
            <h3 className="text-lg font-semibold mb-4" style={{fontFamily:headingFont}}>Configure Report</h3>
            {message && <div className="text-green-500 mb-2">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" style={{fontFamily:paraFont}}>Header</label>
                <select
                  value={headerId}
                  onChange={(e) => setHeaderId(e.target.value)}
                  className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                style={{fontFamily:paraFont}}>
                  <option value="">Select Header</option>
                  {headers.map(header => (
                    <option key={header._id} value={header._id}>
                      {header.imageUrl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" style={{fontFamily:paraFont}}>Footer</label>
                <select
                  value={footerId}
                  onChange={(e) => setFooterId(e.target.value)}
                  className="form-control outline-0 w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200"
                >
                  <option value="">Select Footer</option>
                  {footers.map(footer => (
                    <option key={footer._id} value={footer._id}>
                      {footer.imageUrl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" style={{fontFamily:paraFont}}>First Page Info</label>
                {firstPageInfo.map((info, index) => (
                  <div key={index} className="mb-2">
                    <InputField
                      label="Text"
                      value={info.text}
                      onChange={(e) => handleFirstPageChange(index, 'text', e.target.value)}
                    />
                    <InputField
                      label="Margin"
                      type="number"
                      value={info.margin}
                      onChange={(e) => handleFirstPageChange(index, 'margin', e.target.value)}
                    />
                    <InputField
                      label="Coordinate Y"
                      type="number"
                      value={info.coordinateY}
                      onChange={(e) => handleFirstPageChange(index, 'coordinateY', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={() => setFirstPageInfo([...firstPageInfo, { text: '', margin: 0, coordinateY: 0 }])}
                 style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                  Add More
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" style={{fontFamily:paraFont}}>Last Page Info</label>
                {lastPageInfo.map((info, index) => (
                  <div key={index} className="mb-2">
                    <InputField
                      label="Text"
                      value={info.text}
                      onChange={(e) => handleLastPageChange(index, 'text', e.target.value)}
                    />
                    <InputField
                      label="Margin"
                      type="number"
                      value={info.margin}
                      onChange={(e) => handleLastPageChange(index, 'margin', e.target.value)}
                    />
                    <InputField
                      label="Coordinate Y"
                      type="number"
                      value={info.coordinateY}
                      onChange={(e) => handleLastPageChange(index, 'coordinateY', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={() => setLastPageInfo([...lastPageInfo, { text: '', margin: 0, coordinateY: 0 }])}
                 style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                  Add More
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700"style={{fontFamily:paraFont}}>Enable Page Number</label>
                <input
                  type="checkbox"
                  checked={enablePageNumber}
                  onChange={() => setEnablePageNumber(!enablePageNumber)}
                  className="form-control mt-1"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 hover:text-red-500"
                 style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
               style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportConfigModal;

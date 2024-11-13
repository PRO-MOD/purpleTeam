import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const EditChallenge = ({ challenge }) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [name, setName] = useState(challenge.name);
  const [category, setCategory] = useState(challenge.category);
  const [description, setDescription] = useState(challenge.description);
  const [connectionInfo, setConnectionInfo] = useState(challenge.connectionInfo);
  const [value, setValue] = useState(challenge.value);
  const [initial, setInitial] = useState(challenge.initial || 0);
  const [minimum, setMinimum] = useState(challenge.minimum || 0);
  const [decay, setDecay] = useState(challenge.decay || 0);
  const [max_attempts, setMax_attempts] = useState(challenge.max_attempts || 0);
  const [state, setState] = useState(challenge.state);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedChallenge = {
        name,
        category,
        description,
        connectionInfo,
        value,
        max_attempts,
        state,
        initial,
        minimum,
        decay
      };

      const response = await fetch(`${apiUrl}/api/challenges/edit/${challenge._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChallenge),
      });

      if (!response.ok) {
        throw new Error('Failed to update challenge');
      }

      const data = await response.json();
      console.log('Challenge updated:', data);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating challenge:', error);
      setError('Failed to update challenge');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 10000);
    }
  };

  return (
    <div className="container mx-auto p-6 " >
      <form method="POST" onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Challenge updated successfully!</p>}
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Challenge Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
            <small className="block text-gray-500">Challenge Category</small>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group" >
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Message
            <small className="block text-gray-500">
              Use this to give a brief introduction to your challenge.
            </small>
          </label>
          <SimpleMDE 
            id="description"
            name="description"
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className="form-group">
          <label htmlFor="connectionInfo" className="block text-sm font-medium text-gray-700">
            Connection Info
            <small className="block text-gray-500">
              Use this to specify a link, hostname, or connection instructions for your challenge.
            </small>
          </label>
          <input
            type="text"
            id="connectionInfo"
            name="connection_info"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={connectionInfo}
            onChange={(e) => setConnectionInfo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value
            <small className="block text-gray-500">
              This is how many points teams will receive once they solve this challenge.
            </small>
          </label>
          <input
            type="number"
            id="value"
            name="value"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
{challenge.type==='dynamic' && (
        <div className="form-group">
          <label htmlFor="initial" className="block text-sm font-medium text-gray-700">
          initial
            <small className="block text-gray-500">
            The starting value for a challenge
            </small>
          </label>
          <input
            type="number"
            id="initial"
            name="initail"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            required
          />
        </div>
        )}

{challenge.type==='dynamic' &&(
        <div className="form-group">
          <label htmlFor="minimum" className="block text-sm font-medium text-gray-700">
          Minimum
            <small className="block text-gray-500">
            The minimum amount of points a challenge can be
            </small>
          </label>
          <input
            type="number"
            id="minimum"
            name="minimum"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={minimum}
            onChange={(e) => setMinimum(e.target.value)}
            required
          />
        </div>
)}

{challenge.type==='dynamic' &&(
        <div className="form-group">
          <label htmlFor="decay" className="block text-sm font-medium text-gray-700">
          decay
            <small className="block text-gray-500">
            How many solves before the challenge reaches its minimum value
            </small>
          </label>
          <input
            type="number"
            id="decay"
            name="decay"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={decay}
            onChange={(e) => setDecay(e.target.value)}
            required
          />
        </div>
)}
        <div className="form-group">
          <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700">
            Max Attempts
            <small className="block text-gray-500">
              Maximum amount of attempts users receive. Leave at 0 for unlimited.
            </small>
          </label>
          <input
            type="number"
            id="max_attempts"
            name="max_attempts"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={max_attempts}
            onChange={(e) => setMax_attempts(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
            <small className="block text-gray-500">
              Changes the state of the challenge (e.g. visible, hidden)
            </small>
          </label>
          <select
            id="state"
            name="state"
            className="form-control block w-full p-2 border border-gray-300 rounded mt-1 focus:border-green-500 focus:ring focus:ring-green-200 outline-0"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditChallenge;

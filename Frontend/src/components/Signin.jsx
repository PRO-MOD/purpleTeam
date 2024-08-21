

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
      const [logoUrl, setLogoUrl] = useState('');
  const [title, setTitle] = useState('');


    useEffect(() => {
        const authToken = localStorage.getItem('Hactify-Auth-token');
        if (authToken) {
            navigate('/');
        }
    }, [navigate]);

    
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/config/eventDetails`);
        const data = await response.json();
        if (response.ok) {
          setLogoUrl(`${apiUrl}${data.url}`);
          setTitle(data.title);
        } else {
          console.error('Error fetching logo and title:', data.error);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchConfig();
  }, [apiUrl]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                localStorage.setItem('Hactify-Auth-token', data.authtoken);
                navigate("/");
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('An error occurred during authentication. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen flex flex-col items-center bg-white">
            {/* Header */}
            <div className="w-full  h-16 bg-brown-650 text-white flex justify-center items-center px-4 py-2">
                {/* Left Logo */}
                {/* <img src="\cyber .jpg" alt="Hacktify Logo" className="h-16 w-32 " /> */}
                
                {/* Heading */}
                <h1 className="text-2xl font-bold ">{title}</h1>
                
                {/* Placeholder for the right side */}
                <div></div>
            </div>

            {/* Sign-in div */}
            <img src={logoUrl} alt="Hacktify Logo" className="w-128 h-64 pt-8 " />
            <div className="w-full h-max md:max-w-md bg-opacity-100 p-8 rounded-lg shadow-lg mt-8">
            <div className="mb-8 text-center">
                   <h1 className='block text-brown-500 text-2xl font-bold mb-2'>Defend the Flag</h1>
                </div>
                {/* Sign-in form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-brown-500 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-brown-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                            />
                            <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
                        </div>
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-brown-500 hover:bg-brown-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : 'Log In'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm mt-4">
                Powered By Hacktify
            </footer>
        </div>
    );
};

export default Signin;


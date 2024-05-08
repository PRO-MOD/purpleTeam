// // // import React, { useState,useEffect } from 'react';
// // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // import { faLock } from '@fortawesome/free-solid-svg-icons';
// // // import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection

// // // const Signin = () => {
// // //     const navigate = useNavigate();
// // //     const [formData, setFormData] = useState({
// // //         email: '',
// // //         password: ''
// // //     });

// // //     useEffect(() => {
// // //         const authToken = localStorage.getItem('Hactify-Auth-token');
// // //         if (authToken) {
// // //             navigate('/');
// // //         }
// // //     }, []);

// // //     const [loading, setLoading] = useState(false);
// // //     const [error, setError] = useState('');

// // //     const handleChange = (e) => {
// // //         setFormData({ ...formData, [e.target.name]: e.target.value });
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         setLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
// // //                 method: 'POST',
// // //                 headers: {
// // //                     'Content-Type': 'application/json'
// // //                 },
// // //                 body: JSON.stringify(formData)
// // //             });

// // //             const data = await response.json();
// // //             setLoading(false);

// // //             if (response.ok) {
// // //                 // Authentication successful, handle redirection
// // //                 localStorage.setItem('Hactify-Auth-token', data.authtoken);
// // //                 navigate("/"); // Redirect to home page
// // //             } else {
// // //                 // Authentication failed, display error message
// // //                 setError(data.error);
// // //             }
// // //         } catch (error) {
// // //             console.error('Error during authentication:', error);
// // //             setError('An error occurred during authentication. Please try again.');
// // //             setLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             {/* Navbar Component */}
// // //             <div className="navbar bg-white h-[50px] w-full shadow-2xl z-5">
// // //                 <div className='w-4/6 full mx-auto '>
// // //                     <h1 className='text-blue-900 text-2xl font-extrabold my-auto'>Hacktify</h1>
// // //                 </div>
// // //             </div>
// // //             <div className="flex flex-col items-center justify-center w-full h-screen relative" style={{ backgroundImage: "url('/map_image.jpg')"}}>
// // //                 {/* <div className="absolute inset-0 bg-gray-200 opacity-50"></div> */}
// // //                 <div className="w-full max-w-xs z-10">
// // //                     <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
// // //                         <div className="mb-4">
// // //                             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
// // //                                 Email
// // //                             </label>
// // //                             <input
// // //                                 type="email"
// // //                                 name="email"
// // //                                 value={formData.email}
// // //                                 onChange={handleChange}
// // //                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// // //                                 id="email"
// // //                             />
// // //                         </div>
// // //                         <div className="mb-6">
// // //                             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
// // //                                 Password
// // //                             </label>
// // //                             <div className="relative">
// // //                                 <input
// // //                                     type="password"
// // //                                     name="password"
// // //                                     value={formData.password}
// // //                                     onChange={handleChange}
// // //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
// // //                                     id="password"
// // //                                 />
// // //                                 <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
// // //                             </div>
// // //                         </div>
// // //                         {error && <div className="text-red-500 mb-4">{error}</div>}
// // //                         <div className="flex items-center justify-center">
// // //                             <button
// // //                                 type="submit"
// // //                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// // //                                 disabled={loading}
// // //                             >
// // //                                 {loading ? "Loading..." : 'Log In'}
// // //                             </button>
// // //                         </div>
// // //                     </form>
// // //                 </div>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default Signin;


// // // import React, { useState,useEffect } from 'react';
// // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // import { faLock } from '@fortawesome/free-solid-svg-icons';
// // // import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection

// // // const Signin = () => {
// // //     const navigate = useNavigate();
// // //     const [formData, setFormData] = useState({
// // //         email: '',
// // //         password: ''
// // //     });

// // //     useEffect(() => {
// // //         const authToken = localStorage.getItem('Hactify-Auth-token');
// // //         if (authToken) {
// // //             navigate('/');
// // //         }
// // //     }, []);

// // //     const [loading, setLoading] = useState(false);
// // //     const [error, setError] = useState('');

// // //     const handleChange = (e) => {
// // //         setFormData({ ...formData, [e.target.name]: e.target.value });
// // //     };

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         setLoading(true);
// // //         setError('');

// // //         try {
// // //             const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
// // //                 method: 'POST',
// // //                 headers: {
// // //                     'Content-Type': 'application/json'
// // //                 },
// // //                 body: JSON.stringify(formData)
// // //             });

// // //             const data = await response.json();
// // //             setLoading(false);

// // //             if (response.ok) {
// // //                 // Authentication successful, handle redirection
// // //                 localStorage.setItem('Hactify-Auth-token', data.authtoken);
// // //                 navigate("/"); // Redirect to home page
// // //             } else {
// // //                 // Authentication failed, display error message
// // //                 setError(data.error);
// // //             }
// // //         } catch (error) {
// // //             console.error('Error during authentication:', error);
// // //             setError('An error occurred during authentication. Please try again.');
// // //             setLoading(false);
// // //         }
// // //     };

// // //     return (
// // //         <>
// // //             {/* Navbar Component */}
// // //             <div className="navbar bg-white h-[50px] w-full shadow-2xl z-5">
// // //                 <div className='w-4/6 full mx-auto '>
// // //                     <h1 className='text-blue-900 text-2xl font-extrabold my-auto'>Hacktify</h1>
// // //                 </div>
// // //             </div>
// // //             <div className="flex flex-col items-center justify-center w-full h-screen relative" style={{ backgroundImage: "url('/map_image.jpg')"}}>
// // //                 {/* <div className="absolute inset-0 bg-gray-200 opacity-50"></div> */}
// // //                 <div className="w-full max-w-xs z-10">
// // //                     <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
// // //                         <div className="mb-4">
// // //                             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
// // //                                 Email
// // //                             </label>
// // //                             <input
// // //                                 type="email"
// // //                                 name="email"
// // //                                 value={formData.email}
// // //                                 onChange={handleChange}
// // //                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// // //                                 id="email"
// // //                             />
// // //                         </div>
// // //                         <div className="mb-6">
// // //                             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
// // //                                 Password
// // //                             </label>
// // //                             <div className="relative">
// // //                                 <input
// // //                                     type="password"
// // //                                     name="password"
// // //                                     value={formData.password}
// // //                                     onChange={handleChange}
// // //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
// // //                                     id="password"
// // //                                 />
// // //                                 <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
// // //                             </div>
// // //                         </div>
// // //                         {error && <div className="text-red-500 mb-4">{error}</div>}
// // //                         <div className="flex items-center justify-center">
// // //                             <button
// // //                                 type="submit"
// // //                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// // //                                 disabled={loading}
// // //                             >
// // //                                 {loading ? "Loading..." : 'Log In'}
// // //                             </button>
// // //                         </div>
// // //                     </form>
// // //                 </div>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default Signin;

// // import React, { useState, useEffect } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faLock } from '@fortawesome/free-solid-svg-icons';
// // import { useNavigate } from 'react-router-dom';

// // const Signin = () => {
// //     const navigate = useNavigate();
// //     const [formData, setFormData] = useState({
// //         email: '',
// //         password: ''
// //     });

// //     useEffect(() => {
// //         const authToken = localStorage.getItem('Hactify-Auth-token');
// //         if (authToken) {
// //             navigate('/');
// //         }
// //     }, [navigate]);

// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState('');

// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setError('');
// //         try {
// //             const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify(formData)
// //             });
// //             const data = await response.json();
// //             setLoading(false);
// //             if (response.ok) {
// //                 localStorage.setItem('Hactify-Auth-token', data.authtoken);
// //                 navigate("/");
// //             } else {
// //                 setError(data.error);
// //             }
// //         } catch (error) {
// //             console.error('Error during authentication:', error);
// //             setError('An error occurred during authentication. Please try again.');
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <div className="flex flex-col sm:flex-row h-screen">
// //             {/* Left div with image */}
// //             <div className="w-full sm:w-1/2 flex items-center justify-center">
// //                 <img src="https://hacktify.in/wp-content/uploads/2023/10/hacktify-logo-design-final.png" alt="Login" className="w-full h-auto max-w-md" />
// //             </div>

// //             {/* Sign-in div on the right */}
// //             <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-white p-8">
// //                 {/* Company logo and name on top */}
// //                 <div className="navbar mb-8">
// //                     <h1 className='text-blue-900 text-2xl font-extrabold'>Welcome</h1>
// //                 </div>

// //                 {/* Sign-in form */}
// //                 <div className="w-full max-w-md">
// //                     <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
// //                         <div className="mb-4">
// //                             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
// //                                 Email
// //                             </label>
// //                             <input
// //                                 type="email"
// //                                 name="email"
// //                                 value={formData.email}
// //                                 onChange={handleChange}
// //                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                 id="email"
// //                             />
// //                         </div>
// //                         <div className="mb-6">
// //                             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
// //                                 Password
// //                             </label>
// //                             <div className="relative">
// //                                 <input
// //                                     type="password"
// //                                     name="password"
// //                                     value={formData.password}
// //                                     onChange={handleChange}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
// //                                     id="password"
// //                                 />
// //                                 <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
// //                             </div>
// //                         </div>
// //                         {error && <div className="text-red-500 mb-4">{error}</div>}
// //                         <div className="flex items-center justify-center">
// //                             <button
// //                                 type="submit"
// //                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// //                                 disabled={loading}
// //                             >
// //                                 {loading ? "Loading..." : 'Log In'}
// //                             </button>
// //                         </div>
// //                     </form>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Signin;


// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLock } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';

// const Signin = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });

//     useEffect(() => {
//         const authToken = localStorage.getItem('Hactify-Auth-token');
//         if (authToken) {
//             navigate('/');
//         }
//     }, [navigate]);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         try {
//             const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             setLoading(false);
//             if (response.ok) {
//                 localStorage.setItem('Hactify-Auth-token', data.authtoken);
//                 navigate("/");
//             } else {
//                 setError(data.error);
//             }
//         } catch (error) {
//             console.error('Error during authentication:', error);
//             setError('An error occurred during authentication. Please try again.');
//             setLoading(false);
//         }
//     };
   
//     return (
//         <div className="flex flex-col sm:flex-row h-screen">
//             {/* Left div with logo */}
//             <div className="w-full sm:w-1/2 flex items-center justify-center">
//                 <img src=" https://hacktify.in/wp-content/uploads/2023/10/hacktify-logo-design-final.png" alt="Logo" className="h-16 w-42 absolute top-4 left-4" />
//                 <div className="pt-16">
//                     <img src="\cyber .jpg" alt="Login" className="w-full h-auto max-w-md" />
//                 </div>
//                 {/* <img src="\cyber .jpg" alt="Login" className="w-full h-auto max-w-md" /> */}
//             </div>

//             {/* Sign-in div on the right */}
//             <div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-white p-8">
//                 {/* Company logo and name on top */}
//                 <div className="navbar mb-8">
//                     <h1 className='text-blue-900 text-2xl font-extrabold'>Welcome</h1>
//                 </div>

//                 {/* Sign-in form */}
//                 <div className="w-full max-w-md">
//                     <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
//                         <div className="mb-4">
//                             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="email"
//                             />
//                         </div>
//                         <div className="mb-6">
//                             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
//                                     id="password"
//                                 />
//                                 <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
//                             </div>
//                         </div>
//                         {error && <div className="text-red-500 mb-4">{error}</div>}
//                         <div className="flex items-center justify-center">
//                             <button
//                                 type="submit"
//                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                                 disabled={loading}
//                             >
//                                 {loading ? "Loading..." : 'Log In'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signin;

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLock } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';

// const Signin = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });

//     useEffect(() => {
//         const authToken = localStorage.getItem('Hactify-Auth-token');
//         if (authToken) {
//             navigate('/');
//         }
//     }, [navigate]);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//         try {
//             const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             setLoading(false);
//             if (response.ok) {
//                 localStorage.setItem('Hactify-Auth-token', data.authtoken);
//                 navigate("/");
//             } else {
//                 setError(data.error);
//             }
//         } catch (error) {
//             console.error('Error during authentication:', error);
//             setError('An error occurred during authentication. Please try again.');
//             setLoading(false);
//         }
//     };

//     return (
//         // <div className="relative h-screen flex items-center justify-center bg-white" style={{backgroundImage: `url('./public/background.png')`, backgroundSize: 'cover'}}>
//         <div className="relative h-screen flex items-center justify-center bg-white">
//         {/* Hacktify Logo */}
//             {/* Hacktify Logo */}
//             <img src="https://eccommonstorage.blob.core.windows.net/codered/uploads/9535ca4e-7a19-4576-98ac-0ae1db1a9980.webp" alt="Hacktify Logo" className="absolute top-0 left-0 h-auto w-56" />

//             {/* Login Image */}
//             <img src="\cyber .jpg" alt="Login" className="absolute top-0 right-0 h-auto w-32 md:w-64" />

//             {/* Sign-in div */}
//             <div className="w-full h-max md:max-w-md bg-opacity-100 p-8 rounded-lg shadow-lg mt-16">
//                 {/* Company logo and name on top */}
//                 <div className="mb-8 text-center">
//                     <h1 className='block text-blue-700 text-2xl font-bold mb-2'>Welcome</h1>
//                 </div>

//                 {/* Sign-in form */}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label htmlFor="email" className="block text-blue-700 text-sm font-bold mb-2">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="email"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label htmlFor="password" className="block text-blue-700 text-sm font-bold mb-2">
//                             Password
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="password"
//                             />
//                             <FontAwesomeIcon icon={faLock} className="absolute right-0 mt-3 mr-3 text-gray-500" />
//                         </div>
//                     </div>
//                     {error && <div className="text-red-500 mb-4">{error}</div>}
//                     <div className="flex items-center justify-center">
//                         <button
//                             type="submit"
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             disabled={loading}
//                         >
//                             {loading ? "Loading..." : 'Log In'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Signin;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const authToken = localStorage.getItem('Hactify-Auth-token');
        if (authToken) {
            navigate('/');
        }
    }, [navigate]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://13.127.232.191:5000/api/auth/login', {
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
                <h1 className="text-2xl font-bold ">Cyber Suraksha Platform </h1>
                
                {/* Placeholder for the right side */}
                <div></div>
            </div>

            {/* Sign-in div */}
            <img src="\cyber .jpg" alt="Hacktify Logo" className="w-128 h-64 pt-8 " />
            
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

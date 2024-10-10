// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

// const PageHeader = ({ pageTitle, route, checkRoute, challengeDetails }) => {
//   const location = useLocation();
//   const pathName = location.pathname;

//   return (
//     <div className="bg-gray-300 flex justify-center items-center py-10">
//       <div className="flex flex-col items-center justify-center">
//         {
//           pageTitle && (
//             <h1 className="text-4xl font-normal mb-4">{pageTitle}</h1>
//           )
//         }
//         {challengeDetails && (
//           <div className="flex flex-col items-center justify-center text-center">
//             <p className="text-3xl font-semibold">{challengeDetails.name}</p>
//             <p className="text-2xl font-medium text-gray-600">{challengeDetails.category}</p>
//             <p className="text-2xl font-medium text-gray-600">{challengeDetails.type}</p>
//             {challengeDetails.state && (
//               <p className={`text-md text-white px-2 rounded-md ${challengeDetails.state === 'hidden' ? "bg-red-500" : "bg-green-500"}`}>
//                 {challengeDetails.state.charAt(0).toUpperCase() + challengeDetails.state.slice(1)}
//               </p>
//             )}
//             <p className="text-2xl ">{challengeDetails.value}</p>
//           </div>
//         )}
//         {pathName === checkRoute && (
//           <Link to={route}>
//             <FontAwesomeIcon icon={faPlus} className='bg-gray-500 ms-4 p-4 rounded-full text-white cursor-pointer font-extrabold' />
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PageHeader;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faFileAlt } from '@fortawesome/free-solid-svg-icons';

const PageHeader = ({ pageTitle, route, checkRoute, challengeDetails, onDelete, onSubmissions }) => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <div className="bg-[#A7E6FF] flex justify-center items-center py-10">
      <div className="flex flex-col items-center justify-center">
        {pageTitle && (
          <h1 className="text-4xl font-normal mb-4">{pageTitle}</h1>
        )}
        {challengeDetails && (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-semibold">{challengeDetails.name}</p>
            <p className="text-2xl font-medium text-gray-600">{challengeDetails.category}</p>
            <p className="text-2xl font-medium text-gray-600">{challengeDetails.type}</p>
            {challengeDetails.state && (
              <p className={`text-md text-white px-2 rounded-md ${challengeDetails.state === 'hidden' ? "bg-red-500" : "bg-green-500"}`}>
                {challengeDetails.state.charAt(0).toUpperCase() + challengeDetails.state.slice(1)}
              </p>
            )}
            <p className="text-2xl ">{challengeDetails.value}</p>
          </div>
        )}
        <div className="flex space-x-4 mt-4">
          {pathName === checkRoute && (
            <Link to={route}>
              <FontAwesomeIcon icon={faPlus} className='bg-[#3ABEF9] p-4 rounded-full text-white cursor-pointer font-extrabold' />
            </Link>
          )}
          {onDelete && (
            
          <button onClick={onDelete} className="bg-red-500 p-4 rounded-full text-white cursor-pointer font-extrabold">
            <FontAwesomeIcon icon={faTrash} />
          </button>
         
          )}

          {/* Add Submissions Icon Button */}
          {onSubmissions && (
          <button onClick={onSubmissions} className="bg-blue-500 p-4 rounded-full text-white cursor-pointer font-extrabold">
            <FontAwesomeIcon icon={faFileAlt} />
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

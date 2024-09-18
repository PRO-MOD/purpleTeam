// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import PageHeader from '../../navbar/PageHeader';
// import EditNavigation from './EditChallenge/EditNavigation';
// import Content from './EditChallenge/Content';
// import EditChallenge from './EditChallenge/EditChallenge';

// const ChallengeDetailsPage = () => {
//   const { id } = useParams(); // Get challenge ID from URL params
//   const [challenge, setChallenge] = useState(null);
//   const [activeTab, setActiveTab] = useState('Files');

//   useEffect(() => {
//     const fetchChallenge = async () => {
//       try {
//         const response = await fetch(`http://localhost:80/api/challenges/details/${id}`);
//         const data = await response.json();
//         setChallenge(data);
//       } catch (error) {
//         console.error('Error fetching challenge details:', error);
//       }
//     };

//     fetchChallenge();
//   }, [id]);
//   if (!challenge) {
//     return <div>Loading...</div>;
//   }

//   const tabs = ['Files', 'Flags', 'Topics', 'Tags', 'Hints', 'Requirements', 'Next', 'Users', 'Config'];

//   return (
//     <div className="w-full">
//       <PageHeader
//         challengeDetails={{
//           name: challenge.name,
//           category: challenge.category,
//           type: challenge.type,
//           state: challenge.state,
//           value: `${challenge.value} points`
//         }}
//       />
//       <div className="flex flex-row">
//         <div className="w-1/2 flex flex-col">
//           <EditNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}/>
//           <div className="m-8">
//             <Content activeTab={activeTab} challengeId={id} />
//           </div>
//         </div>
//         <div className="w-1/2">
//           <EditChallenge challenge={challenge}/>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default ChallengeDetailsPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../navbar/PageHeader';
import EditNavigation from './EditChallenge/EditNavigation';
import Content from './EditChallenge/Content';
import EditChallenge from './EditChallenge/EditChallenge';

const ChallengeDetailsPage = () => {
  const { id } = useParams(); // Get challenge ID from URL params
  const [challenge, setChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('Files');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`http://localhost:80/api/challenges/details/${id}`);
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error('Error fetching challenge details:', error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:80/api/challenges/delete/${id}`, { method: 'DELETE' });
      navigate('/challenges'); // Redirect to challenges page after deletion
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const handleSubmissions = () => {
    navigate(`/challenges/submissions/${id}`);
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const tabs = ['Files', 'Flags', 'Topics', 'Tags', 'Hints', 'Requirements', 'Next', 'Users', 'Config'];

  return (
    <div className="w-full">
      <PageHeader
        challengeDetails={{
          name: challenge.name,
          category: challenge.category,
          type: challenge.type,
          state: challenge.state,
          value: `${challenge.value} points`
        }}
        onDelete={handleDelete}    // Pass delete handler
        onSubmissions={handleSubmissions}  // Pass submissions handler
      />
      <div className="flex flex-row">
        <div className="w-1/2 flex flex-col">
          <EditNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          <div className="m-8">
            <Content activeTab={activeTab} challengeId={id} />
          </div>
        </div>
        <div className="w-1/2">
          <EditChallenge challenge={challenge} />
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;

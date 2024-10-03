import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../Challenges/navbar/PageHeader';
import EditNavigation from '../../Challenges/challenges/ChallengeDetails/EditChallenge/EditNavigation';
import Content from './Content';
import EditReport from './EditReport';
import { formatDate } from '../../../assets/utils/formatDate';

const ReportDetails = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { id } = useParams(); 
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/reports/details/${id}`);
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error fetching report details:', error);
      }
    };

    fetchReport();
  }, [id]);

  if (!report) {
    return <div>Loading...</div>;
  }

  const tabs = ['Questions', 'Config', 'Stats'];

  return (
    <div className="w-full">
      <PageHeader
        pageTitle={report.name}
        challengeDetails={
          {
            name: "",
            value: `Deadline: ${formatDate(report.deadline)}`,
            type: report.description,
          }
        }
      />
      <div className="flex flex-row">
        <div className="w-1/2 flex flex-col">
          <EditNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          <div className="m-8">
            <Content activeTab={activeTab} reportId={id} />
          </div>
        </div>
        <div className="w-1/2">
          <EditReport report={report} />
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;

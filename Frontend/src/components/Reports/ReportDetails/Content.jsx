import React from 'react';

// import components
import Questions from './Content/Question/Questions';
import ConfigMain from './Content/Config/ConfigMain';
import Scenarios from './Content/Scenario/Scenario';

const Stats = () => <div>Stats Content</div>;

const Content = ({ activeTab, reportId }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Questions':
        return <Questions reportId={reportId}/>;
      case 'Scenario':  // New case for Scenarios
        return <Scenarios reportId={reportId} />;
      case 'Config':
        return <ConfigMain reportId={reportId}/>;
      case 'Stats':
        return <Stats />
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Content;

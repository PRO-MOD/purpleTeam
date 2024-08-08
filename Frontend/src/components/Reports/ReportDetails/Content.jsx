import React from 'react';

// import components
import Questions from './Content/Question/Questions';

// const Questions = () => <div>Questions Content</div>;
const Config = () => <div>Config Content</div>;
const Stats = () => <div>Stats Content</div>;

const Content = ({ activeTab, reportId }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Questions':
        return <Questions reportId={reportId}/>;
      case 'Config':
        return <Config challengeId={reportId}/>;
      case 'Stats':
        return <Stats />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Content;

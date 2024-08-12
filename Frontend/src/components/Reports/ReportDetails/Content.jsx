import React from 'react';

// import components
import Questions from './Content/Question/Questions';
import ConfigMain from './Content/Config/ConfigMain';

const Stats = () => <div>Stats Content</div>;

const Content = ({ activeTab, reportId }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Questions':
        return <Questions reportId={reportId}/>;
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

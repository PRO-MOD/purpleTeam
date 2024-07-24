import React from 'react';
import Files from './Contents/Files'
import Flags from './Contents/Flags';
import Hints from './Contents/Hints';
import Tags from './Contents/Tags';
// const Flags = () => <div>Flags Content</div>;
const Topics = () => <div>Topics Content</div>;
// const Tags = () => <div>Tags Content</div>;
// const Hints = () => <div>Hints Content</div>;
const Requirements = () => <div>Requirements Content</div>;
const Next = () => <div>Next Content</div>;

const Content = ({ activeTab, challengeId }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Files':
        return <Files challengeId={challengeId}/>;
      case 'Flags':
        return <Flags challengeId={challengeId}/>;
      case 'Topics':
        return <Topics />;
      case 'Tags':
        return <Tags challengeId={challengeId} />;
      case 'Hints':
        return <Hints challengeId={challengeId} />;
      case 'Requirements':
        return <Requirements />;
      case 'Next':
        return <Next />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Content;

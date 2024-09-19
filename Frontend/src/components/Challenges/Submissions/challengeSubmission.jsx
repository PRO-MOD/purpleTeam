import React, { useEffect, useState } from 'react';
import SubmissionTable from './submission';
import { useParams, useNavigate } from 'react-router-dom';

function ChallengesSubmissions(){
  const { id } = useParams();
  return (
    <SubmissionTable challengeId={id}/>
  )
}
export default ChallengesSubmissions;
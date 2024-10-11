import React from 'react';
import PageHeader from '../Challenges/navbar/PageHeader';
import AllRepositories from './AllRepositories';


const Repository=()=>{
 return (
    <>
          <PageHeader pageTitle="Repository" route="/createRepo" checkRoute='Repository'/>
          <AllRepositories/>

    </>
 )
}

export default Repository;
import { useState, useEffect } from 'react';
import React from 'react';

// component imports
import PageHeader from '../navbar/PageHeader';
import RadioCard from './Partials/RadioCard';
import CreateChallengeForm from './CreateChallengeForm';

const CreateChallenge = () => {
    const [selectedOption, setSelectedOption] = useState('standard');

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    useEffect(() => {
        // Ensure the selectedOption state is updated before rendering the form
        console.log(`Selected Option: ${selectedOption}`);
    }, [selectedOption]);

    return (
        <>
            <PageHeader pageTitle="Create Challenge" />
            <div className='flex flex-row justify-center items-start my-8'>
                <div className='flex justify-end items-end w-1/4 py-4'>
                    <div className='flex flex-col justify-center w-5/6 '>
                        <h1 className='text-xl font-normal mx-auto'>Challenge Types</h1>
                        <div id="create-chals-select" className="flex flex-col my-8 space-y-2">
                            <RadioCard
                                id="standard"
                                name="type"
                                value="standard"
                                checked={selectedOption === 'standard'}
                                onChange={handleChange}
                                label="Standard"
                            />
                            <RadioCard
                                id="multiple_choice"
                                name="type"
                                value="multiple_choice"
                                checked={selectedOption === 'multiple_choice'}
                                onChange={handleChange}
                                label="Multiple Choice"
                            />
                            <RadioCard
                                id="manual_verification"
                                name="type"
                                value="manual_verification"
                                checked={selectedOption === 'manual_verification'}
                                onChange={handleChange}
                                label="Manual Verification"
                            />
                            <RadioCard
                                id="code"
                                name="type"
                                value="code"
                                checked={selectedOption === 'code'}
                                onChange={handleChange}
                                label="Code"
                            />
                            <RadioCard
                                id="dynamic"
                                name="type"
                                value="dynamic"
                                checked={selectedOption === 'dynamic'}
                                onChange={handleChange}
                                label="Dynamic"
                            />
                        </div>
                    </div>
                </div>
                <div className='w-3/4'>
                    {
                        selectedOption && 
                        <CreateChallengeForm selectedOption={selectedOption} />
                    }
                </div>
            </div>
        </>
    );
};

export default CreateChallenge;

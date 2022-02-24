import React, { useState } from 'react';
import { requestBruteforceHashResult, verifyHashProof } from '../utils/api';
import './style.css';

function Form() {
    // Create state variables for the form fields
    // Initialize with default data
    const [textToHash, setTextToHash] = useState('');
    const [hashPrefixCount, setHashPrefixCount] = useState('20'); // default to 20 0s, but allow user to edit
    const [counter, setCounter] = useState('');
    const [status, setStatus] = useState('unsubmitted'); 
    const [mode, setMode] = useState('bruteforce');

    const handleInputChange = (e) => {
        const { target } = e;
        const inputName = target.name;
        const inputValue = target.value;

        if (inputName === 'textToHash') {
            setTextToHash(inputValue);
            setStatus('unsubmitted')
        } else if (inputName === 'hashPrefixCount') {
            setHashPrefixCount(inputValue);
            setStatus('unsubmitted')
        } else if (inputName === 'counter') {
            setCounter(inputValue);
            setStatus('unsubmitted')
        } else if (inputName === 'status') {
            setStatus(inputValue);
        } else if (inputName === 'mode') {
            setMode(inputValue);
            setStatus('unsubmitted')
        }
    }

    const handleFormSubmit = (e) => {
        // Prevent native html form submission - handle it here
        e.preventDefault();

        setStatus('calculating');

        
        // if (!validateTextToHash(textToHash) || !textToHash) {
        //     setErrorMessage('Message to be hashed is invalid.'); // not sure when any string would be invalid, since even an empty string will hash, but a validator is good in general
        // }
        // if (!validateHashPrefixCount(hashPrefixCount) || !hashPrefixCount) {
        //     setErrorMessage('Specify the number of 0s required for the resulting hash prefix');
        // }

        let requestFunction;
        let requestData;
        if (mode === 'bruteforce'){
            setCounter('');
            requestFunction = requestBruteforceHashResult;
            requestData = {textToHash, hashPrefixCount};
        } else if (mode === 'verify') {
            requestFunction = verifyHashProof;
            requestData = {textToHash, hashPrefixCount, counter};
        }
        
        requestFunction(requestData)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json'); // make sure we are getting json
            const data = isJson && await response.json();

            if (!response.ok) {
                // if server responds with a non-200 code, 
                const error = (data && data.message) || response.status;
                return Promise.reject(error); // can't 'throw' in async calls; must reject the promise instead (does the same overall thing)
            }


            if (mode === 'bruteforce'){
                setCounter(data.counter);
                if (data.counter >= 0){
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } else if (mode === 'verify') {
                if (data.validProof){
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            }
            
        })
        .catch(error => {
            console.error('There was an error!', error);
        })
        // const getBruteforceHash = async (hashRequest) => {
        //     try {
        //         const res = await requestBruteforceHashResult(hashRequest);
        //         if (!res.ok) {
        //             throw new Error('Unable to find hash within 3,000,000 attempts'); // @TODO better error message. api could return max allowed attempts
        //         }

        //         const attemptCounter = await res.json();
        //         setResult
        //     } catch (err) {
        //         console.error(err);
        //     }
        // };
        // getBruteforceHash({textToHash, hashPrefixCount});
    }



    return (
        <div>
            <p>Sha256 Brute-force Service</p>
            <form className={"form " + status}>
                <div>
                    <label>
                        <input 
                            type="radio" 
                            value="bruteforce" 
                            name="mode" 
                            checked={mode === "bruteforce"}
                            onChange={handleInputChange}
                        />
                        <span>Brute Force</span>
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="verify" 
                            name="mode" 
                            checked={mode === "verify"}
                            onChange={handleInputChange}
                        />
                        <span>Verify</span>
                    </label>
                </div>
                <div>
                    <label>
                        <input 
                            value={textToHash}
                            name="textToHash"
                            onChange={handleInputChange}
                            type="textToHash"
                            placeholder="Some text"
                        />
                        <span>String to hash</span>

                    </label>
                </div>
                <div>
                    <label>
                        <input 
                            value={hashPrefixCount}
                            name="hashPrefixCount"
                            onChange={handleInputChange}
                            type="hashPrefixCount"
                            placeholder="20"
                        />
                        <span>Difficulty of proof (number of 0s)</span>

                                                
                    </label>
                </div>
                <div>
                
                    {mode === 'bruteforce' 
                    ?
                        (
                            status === 'unsubmitted'
                            ?
                            <span>Submit to calculate counter</span>
                            :
                            <span>Counter: {counter}</span>
                        )
                        
                        
                    
                    :
                        <label>
                            <input
                            value={counter}
                            name="counter"
                            onChange={handleInputChange}
                            type="counter"
                            placeholder=""
                            readOnly={mode === 'bruteforce' ? true : false} 
                            
                            />
                            <span>Counter</span>

                        </label>
                    }
                </div>    
                
                 
                <div>
                <button
                    type="button"
                    onClick={handleFormSubmit}
                >
                    Submit
                </button>
                </div>
            </form>
            {/* {errorMessage && (
                <div>
                    <p className="error-text">{errorMessage}</p>
                </div>
            )} */}
        </div>

    );
}

export default Form;
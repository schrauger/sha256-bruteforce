import React, { useState } from 'react';
import { requestBruteforceHashResult, verifyHashProof } from '../utils/api';
import './style.css';

// @TODOS
// * validate user input
// * set a max difficulty to a sane amount
// * prevent double submissions
// * make it prettier

function Form() {
    // Create state variables for the form fields
    // Initialize with default data
    const [textToHash, setTextToHash] = useState('');
    const [hashPrefixCount, setHashPrefixCount] = useState('20'); // default to 20 0s, but allow user to edit
    const [counter, setCounter] = useState('');
    const [status, setStatus] = useState('unsubmitted'); 
    const [mode, setMode] = useState('bruteforce');


    // generic input handler for all inputs
    const handleInputChange = (e) => {
        const { target } = e;
        const inputName = target.name;
        const inputValue = target.value;


        if (inputName === 'textToHash') {
            setTextToHash(inputValue);
            setStatus('unsubmitted') // when the user changes any value, reset the form to 'unsubmitted'
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

        let requestFunction;
        let requestData;

        // submit to two different backends, depending on the mode
        if (mode === 'bruteforce'){
            setCounter('');
            requestFunction = requestBruteforceHashResult; 
            requestData = {textToHash, hashPrefixCount};
        } else if (mode === 'verify') {
            requestFunction = verifyHashProof;
            requestData = {textToHash, hashPrefixCount, counter};
        }
        
        requestFunction(requestData) // send the POST request to the server for computation
        .then(async response => {
            // when the server responds correctly, we can update our states based on the result
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

         // if the server fails, set it to invalid. in case the request times out or the server is unavailable.
        .catch(error => {
            console.error('There was an error!', error);
            setStatus('invalid');
        })
    }


    // build up the entire form
    return (
        <div>
            <p>Sha256 Brute-force Service</p>
            <h2>
                {mode === 'bruteforce' ? bruteforceMessage(status) : verifyMessage(status)}
            </h2>
            <form className={"form " + status} >
                <div className='form-group'>
                    <label htmlFor='modeBruteforce'>   
                    <input 
                        id="modeBruteforce"
                        type="radio" 
                        value="bruteforce" 
                        name="mode" 
                        checked={mode === "bruteforce"}
                        onChange={handleInputChange}
                    />
                                         
                        <span>Brute Force</span>
                    </label>
                </div>
                <div>
                    <label htmlFor='modeVerify'>
                        <input 
                            id="modeVerify"
                            type="radio" 
                            value="verify" 
                            name="mode" 
                            checked={mode === "verify"}
                            onChange={handleInputChange}
                        />
                    
                    
                        <span>Verify</span>
                    </label>
                </div>
                <div className='form-group'>
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
                <div className='form-group'>
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
                <div className='form-group'>
                
                    {mode === 'bruteforce' 
                    ?
                        (
                            status === 'unsubmitted'
                            ?
                            <span>Submit to calculate counter</span>
                            :
                            <span>Counter: {counter ? counter : "Calculating"}</span>
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
                <button
                    type="button"
                    onClick={handleFormSubmit}
                >
                    Submit
                </button>
            </form>
        </div>

    );
}

/**
 * Returns a printable string based on the internal status - used for 'bruteforce' mode
 * @param {*} status 
 * @returns 
 */
function bruteforceMessage (status) {

    switch (status) {
        case 'unsubmitted':
            return ('Submit the form to bruteforce the desired hash');
        case 'calculating':
            return ('Waiting for server calcultions');
        case 'valid':
            return ('Hash found!');
        case 'invalid':
            return ('Unable to bruteforce a hash with the requested parameters');
        default :
            return ('');
    }
}


/**
 * Returns a printable string based on the internal status - used for 'verify' mode
 * @param {*} status 
 * @returns 
 */
function verifyMessage (status) {

    switch (status) {
        case 'unsubmitted':
            return ('Submit the form to verify proof');
        case 'calculating':
            return ('Waiting for server calcultions');
        case 'valid':
            return ('Hash verified!');
        case 'invalid':
            return ('Unable to verify the hash with the requested parameters');
        default :
            return ('');
    }
}

export default Form;
const e = require('express');
const sha256 = require('js-sha256');

/**
 * Blindly brute-forces sha256 hashes until it finds one that
 * starts with the prefix requested.
 * Returns the counter value used to find a matching hash
 * 
 * @param {string} plainString 
 * @param {string} binaryHashPrefix 
 * @returns integer Counter value to use for this string to get a hash with the desired prefix
 */
const bruteForceHashPrefix = (plainString, binaryHashPrefix) => {
    let foundProof = false;
    let i = 0;
    while (foundProof !== true && i < 3000000) {
        i++
        foundProof = computeHashDerivation(plainString, i, binaryHashPrefix);
    }
    if (foundProof) {
        //console.log('counter: ', i);
        return i;
    } else {
        //console.log('Failed to find within 3,000,000 hashes');
        return -1;
    }
};

/**
 * Returns true if the computed sha256 binary value of plainString + counter
 * begins with the binaryHashPrefix string passed in
 * @param {string} plainString 
 * @param {number} counter 
 * @param {string} binaryHashPrefix The string prefix, in binary, to match with the start of the computed hash value
 * @returns 
 */
const computeHashDerivation = (plainString, counter, binaryHashPrefix) => {
    const hashHexValue = sha256(plainString + counter);

    const hashBinaryValue = parseInt(hashHexValue, 16).toString(2).padStart(256, '0');

    proofValid = hashBinaryValue.startsWith(binaryHashPrefix.toString(2));

    // if (proofValid) {
    //     console.log('################################');
    //     console.log(hashBinaryValue);
    // }
    return proofValid;
}

module.exports = {bruteForceHashPrefix, computeHashDerivation};
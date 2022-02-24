export const requestBruteforceHashResult = (hashRequest) => {
    return fetch('/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hashRequest),
    });
};

export const verifyHashProof = (hashRequest) => {
    return fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hashRequest),
    });
}
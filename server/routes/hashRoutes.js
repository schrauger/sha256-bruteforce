const router = require('express').Router();
const {bruteForceHashPrefix, computeHashDerivation} = require('../helpers/hashTools');

// // print out the front page
// router.get('/', async (req, res) => {
//     console.log('hello');
//     res.json({title: "hi"});
// })

router.post('/find', async(req, res) => {
    // this function could get very costly. in the future, I'd POST to this url, but then check a different API every second to wait for the hash computations to complete

    // first, get the POST variables
    const {textToHash, hashPrefixCount} = req.body;
    // let str_source = req.query.source;
    // let str_binary_prefix = parseInt(req.query.hex, 16).toString(2); // an advanced option that lets you search for any hex prefix, not just leading zeroes
    // let int_prefix_length = (req.query.zeroBitCount) ? req.query.zeroBitCount : 10; // default to 10 zeroes if not supplied
    
    // If the user specified a hash, overwrite the prefix bit length with the hex to binary string length
    // if (str_hex_prefix) {
    //     prefixBitLength = parseInt(hashPrefixHexString, 16).toString(2).length;
    // }

    const counter = bruteForceHashPrefix(textToHash, '0'.repeat(hashPrefixCount))

    res.json({counter});

})

router.post('/verify', async(req,res) => {
    const {textToHash, counter, hashPrefixCount} = req.body;



    const validProof = computeHashDerivation(textToHash, counter, '0'.repeat(hashPrefixCount));

    res.json({validProof});

})

module.exports = router;
const router = require('express').Router();
const hashFunctions = require('./hashRoutes');

router.use(hashFunctions);

module.exports = router;
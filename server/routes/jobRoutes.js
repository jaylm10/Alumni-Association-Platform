const express = require('express');
const {jobPosting,getJobs,getJobById} = require("../controller/jobController")
const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.post('/post',authMiddleware,jobPosting);
router.get('/',authMiddleware,getJobs);
router.get('/:id',authMiddleware,getJobById);



module.exports = router;
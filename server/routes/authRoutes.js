const express = require('express');
const {register,login,googleauth} = require("../controller/authController")

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/google-auth',googleauth);


module.exports = router;
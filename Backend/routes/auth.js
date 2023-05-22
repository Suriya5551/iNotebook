const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRECT = "Raviisagoodboy$";

// user login ROUTE 1
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // errors 
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    // user already exists with the same email
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "sorry a user with this email already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user:{
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRECT);
        
        success= true;
        res.json({success, authtoken})
    }
    catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
    // .then(user => res.json(user));
})

// authenticate the login ROUTE 2
router.post('/login', [
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be atleast 5 character').exists(),
],async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // errors 
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error: "login with proper credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "login with proper credentials" });
        }

        const data = {
            user: {
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRECT);
        success = true;
        res.json({success, authtoken})
    }  catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
}
)
// ROUTE 3
router.post('/getuser', fetchuser, async (req,res)=>{
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

module.exports = router


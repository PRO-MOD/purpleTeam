
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = process.env.JWT_SECRET; // This is to be stored in env.local for security purposes.


// Route 1: route for the api with the route og localhost/api/auth/createuser
router.post('/createuser', async (req, res) => {
    let success = false;

    try {
        userEmail = (await User.find({ email: req.body.email })).length
        if (userEmail == 0) {
            let salt = bcrypt.genSaltSync(10);
            let securedPass = bcrypt.hashSync(req.body.password, salt);
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securedPass,
                role: req.body.role
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authtoken });
        } else {
            return res.status(400).json({ error: "Email Id already Exists" })
        }
    } catch (err) {
        res.status(500).send("Internal Server Error occured while Authennticating")
    }
})

// Route to add multiple users to assignedTeams
router.post('/addUsers/:userId', async (req, res) => {
    const { userId } = req.params;
    const { selectedUserIds } = req.body; // Array of selected user IDs
  
    try {
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user || !(user.role == "WT")) {
        return res.status(404).json({ message: 'User not found or user might not be Volunteer' });
      }
  
      // Add the selectedUserIds to the assignedTeams array
      user.assignedTeams.push(...selectedUserIds);
  
      // Save the updated user
      await user.save();
  
      return res.status(200).json({ message: 'Users added to team successfully', user });
    } catch (error) {
      console.error('Error adding users to team:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });



// Route 2: route for the api with the route og localhost/api/auth/login
router.post('/login', async (req, res) => {
    let success = false;

    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const comparePass = bcrypt.compareSync(req.body.password, user.password);
            if (comparePass) {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                success = true;
                const authtoken = jwt.sign(data, JWT_SECRET);
                res.json({ success, authtoken });
            }
            else {
                return res.status(400).json({
                    error: "User does not Exists / Invalid Credentials"
                })
            }


        } else {
            return res.status(400).json({ error: "User does not Exists / Invalid Credentials" })
        }
    } catch (err) {
        res.status(500).send("Internal Server Error occured while Authennticating")
    }


})


// Route 3: route for the api with the route of localhost/api/auth/getuser with a MIDDLEWARE
// router.post('/getuser', fetchuser, async (req, res) => {

//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId).select("-password");
//         res.send(user);


//     } catch (err) {
//         res.status(500).send("Internal Server Error occured while getting the user from JWT token || MiddleWare")
//     }


// })





module.exports = router

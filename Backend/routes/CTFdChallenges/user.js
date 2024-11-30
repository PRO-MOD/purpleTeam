const express = require('express');
const router = express.Router();
const User= require('../../models/User')
const BT = process.env.BT;
const WT = process.env.WT;


router.get('/getallusers', async (req, res) => {
  try {
    const users = await User.find({ role: BT }).select('_id name ');// Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
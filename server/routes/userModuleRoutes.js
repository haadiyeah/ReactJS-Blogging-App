const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
require('dotenv').config();
const router = express.Router();

//authentication middleware:
const authenticateToken = require('../middleware/authenticateToken');

router.post('/login', async (req, res) => {
  if (!(req.body.email && req.body.password)) {
    return res.status(400).send('All fields not provided');
  }

  //checking user email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send('Invalid email');
  }
  if (user.isBlocked) {
    return res.status(403).send('Access denied - you were blocked by the admin');
  }

  //checking user pass 
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  //getting token using jwt
  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.SECRET);


  res.status(200).json({ token });//returning token
});

router.post('/register', async (req, res) => {
  try {

    if (!(req.body.username && req.body.email && req.body.password)) {
      return res.status(400).send('All fields not provided');
    }
    //existing user check
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(422).send('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //if role given (else default = 'user' )
    if (req.body.role) {
      user.role = req.body.role;
    }
    await user.save(); //saving in db
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.log(error);

    if (error instanceof mongoose.Error && error.code === 11000) { //duplicate key error for email
      return res.status(422).send('Username already in use');
    }
    res.status(500).send("errrr" + error);
  }
});

///this assumes that token is in the req's header's authorization part
router.get('/profile', authenticateToken, (req, res) => {
  res.status(200).json(req.user);
});

//proifele update
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.body) {
      res.status(422).send('Cannot update with no data');
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).send('User profile updated successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating user profile');
  }
});

module.exports = router;
const express = require('express')
const router = express.Router()
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

router.post('/', async (req, res) => {
    console.log(req.body);
    const note = Note(req.body);
    note.save();
    res.send(req.body)
    
})

// Route 1: Get All the Notes using: GET route of "localhost/api/notes/fetchallnotes" with a MIDDLEWARE
router.get('/fetchallnotes', fetchuser,async(req, res)=>{

  try {
    const userId = req.user._id; 
    const note = await Note.find({user: userId});
    res.json(note);
  } catch (err) {
    res.status(500).json("Internal Server Error || fetchallnotes")
  }


})

// Route 2: Add the Notes using: POST route of "localhost/api/notes/addnote" with a MIDDLEWARE
router.post('/addnote', fetchuser,[body('title', "Name should atleast be of length 3").isLength({min: 3}), body('description','description  should atleast be of length 3 !').isLength({min: 3}), body('tag', "Tag should atleast be of length 2").isLength({min: 2})],async(req, res)=>{

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({errors: error.array()})
    }

  try {
    const userId = req.user.id; 
    const {title, description, tag} = req.body
    const note = new Note({user: userId, title: title, description: description,tag: tag});
    note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send("Internal Server Error || Insertion")
  }
})

// Route 3: Update the Notes using: PUT route of "localhost/api/notes/updatenote/:id" with a MIDDLEWARE
router.put('/updatenote/:id', fetchuser,async(req, res)=>{

  try {
    const userId = req.params.id; 
    const {title, description, tag} = req.body
    let updateData = {}
    if(title) updateData.title = title;
    if(description) updateData.description = description;
    if(tag) updateData.tag = tag;

    let note = await Note.findById(userId);
    if(!note) return res.status(404).send("Not Found");
    if(note.user.toString() !== req.user.id) return res.status(500).send("Not Allowed || Bad Request")
    
    note = await Note.findByIdAndUpdate(userId,{$set: updateData},{new: true});
    note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send("Internal Server Error || put");
  }
})

// Route 4: Delete the Note using: DELETE route of "localhost/api/notes/deletenote/:id" with a MIDDLEWARE
router.delete('/deletenote/:id', fetchuser,async(req, res)=>{

  try {
    const userId = req.params.id; 
    let note = await Note.findById(userId);
    if(!note) return res.status(404).send("Not Found");
    if(note.user.toString() !== req.user.id) return res.status(500).send("Not Allowed || Bad Request")

    note = await Note.findByIdAndDelete(userId);
    res.json(note);
  } catch (err) {
    res.status(500).send("Internal Server Error || Delete")
  }
})


  module.exports = router
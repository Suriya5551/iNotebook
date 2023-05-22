const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes')
require('events').EventEmitter.prototype._maxListeners = 100;

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// add a new note
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
  ], async (req, res, next) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title, description, tag, user: req.user.id
      });
      const savedNote = await note.save();
      return res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      return next(error);
    }
  });

// update the note
router.put('/updatenote/:id', fetchuser, async (req, res) =>{
    const {title, description, tag} = req.body;
    //create a newnote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Foound")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
})

// delete an existing note
router.delete('/deletenote/:id', fetchuser, async (req, res) =>{
    try {
        // find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note) { return res.status(404).send("Not Found")}

        // Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");

        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted", note: note});

    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
  
    

module.exports = router
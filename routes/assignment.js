const express = require('express');
const router = express.Router();
const Assignment = require('../models/assignment_db');

let mongoose = require('mongoose')
function requireAuth(req,res,next){
  console.log('Middleware called');

  if(!req.isAuthenticated())
  {
    return res.redirect('/login')
  }
  next()
}

// Read operation 
router.get('/', requireAuth,async (req, res, next) => {
  try {
    const assignList = await Assignment.find().exec();
    console.log(assignList); 
    res.render('assignments', { assignList, displayname: req.user ? req.user.displayname : ''  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// render a form to add a new assignment
router.get('/new',requireAuth, (req, res) => {
  res.render('newassignment');
});

// handle the form submission to add a new assignment
router.post('/new',requireAuth, async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.redirect('/assignments');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// render a form to edit an existing assignment
router.get('/edit/:id',requireAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).exec();
    res.render('editassignment', { assignment, displayname: req.user ? req.user.displayname : '' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// handle the form submission to edit an existing assignment
router.post('/edit/:id',requireAuth, async (req, res) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, req.body).exec();
    res.redirect('/assignments');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete operation 
router.get('/delete/:id',requireAuth, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id).exec();
    res.redirect('/assignments');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Render editAssignment.ejs 
router.get(['/editassignment/:id', '/editassignment'],requireAuth, async (req, res) => {
  console.log('Reached /editassignment/:id route');
  if (req.params.id) {
    try {
      const assignment = await Assignment.findById(req.params.id).exec();
      if (!assignment) {
        res.status(404).send('Assignment not found');
        return;
      }
      res.render('editassignment', { assignment, displayname: req.user ? req.user.displayname : '' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Render the editassignment.ejs for static route
    res.render('editassignment', { title: 'editassignment', displayname: req.user ? req.user.displayname : ''  });
  }
});

module.exports = router;

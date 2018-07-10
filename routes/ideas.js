const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
  ensureAuthentication
} = require('../helpers/auth');

//Load Idea Model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//Idea Route
router.get('/', ensureAuthentication, (req, res) => {
  Idea.find({
      user: req.user.id
    })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//add idea form
router.get('/add', ensureAuthentication, (req, res) => {
  res.render('ideas/add');
});

//edit Idea form
router.get('/edit/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized")
        res.redirect('/ideas')
      } else {
        res.render('ideas/edit', {
          idea: idea
        });
      }
    });
});

//Process Form (add idea)
router.post('/', ensureAuthentication, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea has been added');
        res.redirect('/ideas');
      });
  }
});

//Edit Form Process (Put requrest needs method.override)
router.put('/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Video idea has been edited')
          res.redirect('/ideas');
        });
    });
});

//delete idea
router.delete('/:id', ensureAuthentication, (req, res) => {
  Idea.remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Idea has been removed')
      res.redirect('/ideas');
    });
});

module.exports = router;

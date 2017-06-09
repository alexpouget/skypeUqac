var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Conversation = require('../models/Conversation.js');
var User = require('../models/User.js');
var Message = require('../models/Message.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
           Conversation.find(function (err, post) {
                         if (err) return next(err);
                             res.json(post);
                             }).populate({path:'participants'}).populate({path:'data',populate:{path:'writer',select:'pseudo'}});
           });


/* GET /todos/id */
router.get('/:id', function(req, res, next) {
           Conversation.findById(req.params.id, function (err, post){
                         if (err) return next(err);
                         res.json(post);
                         }).populate({path:'participants'}).populate({path:'data',populate:{path:'writer',select:'pseudo'}});
           });

router.get('/user/:id', function(req, res, next) {
           Conversation.find().populate({path:'participants'}).populate({path:'data',populate:{path:'writer',select:'pseudo'}}).exec(function (err, post){
                                 if (err) return next(err);
                                 var conv = [];
                                post.forEach(function(element) {
                                    element.participants.forEach(function(e){
                                        if(e._id==req.params.id){
                                            conv.push(element);
                                        }
                                    });
                                 });
                                 res.json(conv);
                                 });
           });


// Post exemple
router.post('/', function(req, res, next) {
            Conversation.create(req.body, function (err, post) {
                        if (err) return next(err);
                        res.json(post);
                        });
            });

// create conversation with id creator as participants
router.post('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, user){
        if (err) return next(err);
        Conversation.create(req.body, function (err, conv) {
            if (err) return next(err);
            conv.participants.push(user)
            conv.save(function (err) {
                if (err) return handleError(err);
                res.json(conv);
                });
            });
    });
});


// add message to conversation default text
router.post('/message/:id', function(req, res, next) {
            User.findById(req.params.id, function (err, user){
                          if (err) return next(err);
                          Conversation.findById(req.body.id, function (err, conv){
                                        if (err) return next(err);
                                        Message.create({content: req.body.content, type: 'text',
                                                               writer: user}, function (err, post) {
                                              if (err) return next(err);
                                              conv.data.push(post)
                                              conv.save(function (err) {
                                            if (err) return handleError(err);
                                                res.json(conv);
                                            });
                                        });
                          });
            });
});

// add participants to conversation
router.post('/addParticipants/:id', function(req, res, next) {
            Conversation.findById(req.params.id, function (err, conv){
                          if (err) return next(err);
                                  User.findById(req.body.name, function(err, user){
                                                if (err) return next(err);
                                                console.log(user);
                                                conv.participants.push(user)
                                                conv.save(function (err) {
                                                          if (err) return handleError(err);
                                                          res.json(conv);
                                                          });
                                                });
            });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
           Conversation(req.params.id, req.body, function (err, post) {
                                  if (err) return next(err);
                                  res.json(post);
                                  });
           });

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
              Conversation.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
                });
              });

module.exports = router;

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Message = require('../models/Message.js');

/* GET Messages listing. */
router.get('/', function(req, res, next) {
           Message.find(function (err, post) {
                         if (err) return next(err);
                     res.json(post);
                             }).populate('writer');
           });


/* GET /todos/id */
router.get('/:id', function(req, res, next) {
           Message.findById(req.params.id, function (err, post){
                         if (err) return next(err);
                         res.json(post);
                         }).populate('writer');
           });

/* GET /todos/id */
router.get('/user/:id', function(req, res, next) {
           Message.find().populate({path: 'writer',match: {writer: req.params.id}})
            .exec(function (err, posts) {
                    if (err) return next(err);
                    posts = posts.filter(function(post) {
                        return post.writer._id;
                    });
                    res.json(posts);
                });
           });

// Post exemple
router.post('/', function(req, res, next) {
            Message.create(req.body, function (err, post) {
                        if (err) return next(err);
                        res.json(post);
                        });
            });


/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
           Message(req.params.id, req.body, function (err, post) {
                                  if (err) return next(err);
                                  res.json(post);
                                  });
           });

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
              Message.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
                });
              });

module.exports = router;

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
           User.find(function (err, post) {
                         if (err) return next(err);
                     res.json(post);
                             }).populate('amis', 'pseudo');
           });


/* GET /todos/id */
router.get('/:id', function(req, res, next) {
           User.findById(req.params.id, function (err, post){
                         if (err) return next(err);
                         res.json(post);
                         }).populate('amis', 'pseudo');
           });

/* GET friend /todos/id */
router.get('/friend/:id', function(req, res, next) {
           User.findById(req.params.id).populate('amis').exec(function (err, post){
                         if (err) return next(err);
                         if(!post){ res.json(post)}
                         else { res.json(post.amis);}
                         });
           });


/* Add friend /todos/id */
router.post('/friend/:id', function(req, res, next) {
            User.findById(req.params.id, function (err, post) {
                     if (err) return next(err);
                     User.findById(req.body.id, function (err, post2) {
                              if (err) return next(err);
                              post2.amis.push(post);
                              post2.save(function (err) {
                                         if (err) return handleError(err);
                                         post.amis.push(post2);
                                         post.save(function (err) {
                                                   if (err) return handleError(err);
                                                   res.json(post);
                                                   });
                                         });
                              
                              });
                     });
            });


// Post exemple
router.post('/', function(req, res, next) {
            User.create(req.body, function (err, post) {
                 if (err) return next(err);
                 res.json(post);
                 });
            });


// Post connexion
router.post('/login', function (req, res) {
            User.findOne({ 'pseudo': req.body.pseudo, 'password': req.body.password })
            .populate('amis')
            .exec(function(err, obj) {
                if (err) return next(err);
                  console.log(obj);
                res.json(obj);
            });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
           User(req.params.id, req.body, function (err, post) {
                                  if (err) return next(err);
                                  res.json(post);
                                  });
           });

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
              User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
                if (err) return next(err);
                res.json(post);
                });
              });

module.exports = router;

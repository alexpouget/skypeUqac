var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

function requireLogin (req, res, next) {
    if (req.session.pseudo) {
        // User is authenticated, let him in
        next();
    } else {
        // Otherwise, we redirect him to login form
        
        res.redirect('/login');
    }
}

/* GET home page. and add 1 visits to count */
router.get('/',[requireLogin], function (req, res) {
           res.render('messenger',{mysession: req.session,amis: req.session.amis,pseudo: req.session.pseudo});
        });

router.get('/login', function (req, res) {
           res.render('login.ejs', { title: 'Login' });
           });

router.post('/login', function (req, res) {
         var options = { "username": req.body.pseudo, "error": null };
         if (!req.body.pseudo) {
            options.error = "User name is required";
            res.render('/login', options);
         } else {
            User.findOne({ 'pseudo': req.body.pseudo, 'password': req.body.password })
            .populate('amis','pseudo')
            .exec(function(err, obj) {
            if (err) return handleError(err);
                console.log(obj);
                if(obj){
                    req.session.idUser = obj._id
                    req.session.pseudo = req.body.pseudo;
                    req.session.email = obj.email;
                    req.session.amis = obj.amis;
                  console.log("id = "+req.session.idUser);
                  res.render('messenger',{mysession: req.session,amis: obj.amis,pseudo: req.body.pseudo});
                }else{
                    console.log("error");
                    options.error = "User name password error";
                    res.render('login', options);
                }
            })
        }
});


module.exports = router;

var express = require('express');
var router = express.Router();

function requireLogin (req, res, next) {
    /*if (req.session.username) {
        // User is authenticated, let him in
        next();
    } else {
        // Otherwise, we redirect him to login form
        res.redirect("/login");
    }*/
    res.redirect("/login");

}

module.export = router;

const express = require("express");
const router = express.Router();

// ***************GEt*********************

router.get("/", (req, res) => {
    res.render("welcome");
});

router.get("/login", (req, res) => {
    res.render("login", {message: null, alertType: "info"});
});

router.get("/register", (req, res) => {
    res.render("register", {message: null, alertType: "info"});
});

router.get("/dashboard", (req, res) => {

    // checking if cookie is present
    let cookieName = req.cookies["jwt"];

    // if not present allow 
    if(!cookieName)
        res.redirect("/");
    
    // else allow
    res.render("dashboard");
})

router.get("/logout", (req, res) => {

    // cookie expires
    res.cookie('jwt', '', {
        maxAge: 0,
        overwrite: true,
      });
      res.redirect("/");
});


module.exports = router;
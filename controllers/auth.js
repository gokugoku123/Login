const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const mysql = require("mysql");
const db = require("../Database/connection");

// register authentication controller
exports.register = (req, res) => {
    
    // field values destructured
    const {name, email, password, password2} = req.body;
    // console.log(req.body);
    
    // get all the fields matching given email
    db.query("SELECT email FROM users WHERE email = ?", [email], async (err, results) => {

        if(err)
            console.log(err);

        // if email is already present
        if(results.length > 0) {
            return res.render("register", {message:"This Email is already taken", alertType: "danger"});

        // if password and confirm password doesn't match
        } else if(password !== password2) {
            return res.render("register", {message:"Passwords do not match", alertType: "danger"});
        }
        
        // hashing the password 10 times
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // insert the new user into the data base
        db.query("INSERT INTO users SET ?", {name: name, email: email, password: hashedPassword}, (err, res) => {
            if(err)
                console.log(err);
            console.log(results);
            console.log("User Registered Successfully");
        });
        return res.render("login", {message: "User Successfully Registered ..You can login now", alertType: "success" });   
    });

}


// login authentication controller

exports.login = async (req, res) => {
    
    const {email, password} = req.body;

    // if any one of the fields are empty
    if(!email || !password) 
        return res.status(400).render("login", {message: "Please provide an email and a password", alertType: "warning"});
    else {

        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if(err)
                console.log(err);

            // if email or password is incorrect
            else if(!results || !(await bcrypt.compare(password, results[0].password))) {
                
                return res.status(401).render("login", {message: "Incorrect username or password", alertType: "danger"});
            } else {
                const id = results[0].id;

                // creating jwt token
                const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_COOKIE_EXPIRES
                });

                // console.log("The token is  " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                // create a cookie and name it as jwt
                res.cookie("jwt", token, cookieOptions);

                // render the dashboard
                return res.status(200).render("dashboard");
            }
        });
    }
}
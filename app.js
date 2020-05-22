require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");


const app = express();
// define port
const PORT = process.env.PORT || 3000;

// parsing the input
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

// use cookies
app.use(cookieParser());

// serve up static files
app.use(express.static(__dirname + "/public"));

// set the template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

// connect to MYSQL database
const db = require("./Database/connection");
db.connect((err) => {
    if(err)
        console.log(err);
    console.log("MYSQL Connected..."); 
});


// configure routes
app.use("/", require("./routes/pages"));

// configure authentication routes
app.use("/auth", require("./routes/auth"));

// port running
app.listen(PORT, console.log("Server running on port " + PORT));
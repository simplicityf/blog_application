const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

//importing mongodb
const connectMongodb = require("./init/mongodb");

//Importing Routes
const {authRoute, categoryRoute, fileRoute, postRoute} = require("./routes");
// Importing Passport.js for authentication and authorization
const passport = require("passport");
require("./passport/passport");  // Require your Passport.js configuration

//Importing errorHandler
const {errorHandler} = require("./middleware");

//Importing secret key
const {my_secret_key} = require("./config/keys")

//Importing the notFound route
const notFound = require("./controllers/notFound")

const app = express();

app.use(cors({origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Optional: allow credentials (cookies, authorization headers, etc.)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization, Content-Type'
    }))
app.use(express.json({limit: "500mb"})); // This parses incoming JSON payloads

app.use(bodyParser.urlencoded({limit: "500mb", extended: true}))
app.use(morgan("dev")); //using Morgan which is use to send request to our console
app.use(errorHandler); // using errorHandler


connectMongodb(); //Connecting to database

// Configure express-session
app.use(session({
    secret: my_secret_key, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());  // For persistent login sessions

//routes section
app.use("/auth", authRoute);
app.use("/category", categoryRoute);
app.use("/file", fileRoute);
app.use("/post", postRoute);

app.use("*", notFound); // using notFound route

module.exports = app;


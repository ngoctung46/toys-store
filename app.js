const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const categoryController = require('./controllers/category.controller');
// Connect to db
mongoose.connect(config.database, { useMongoClient: true });

// Initialize app variable
const app = express();

// Declaring Port
const port = process.env.PORT || 3000;

// Middle wares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, `public`)));
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send("Invalid page");
});

app.use('/api/category', categoryController);

// Delegate routing for angular 
app.use('**', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Listening to 3000 port
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});
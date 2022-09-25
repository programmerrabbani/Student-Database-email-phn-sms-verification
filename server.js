const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const expressLayout = require('express-ejs-layouts');
const studentRoute = require('./routes/studentRoute');

// environment variable

const PORT = process.env.PORT || 7070;

// init express

const app = express();

// data manage

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init EJS

app.set("view engine", "ejs");
app.use(expressLayout)
app.set("layout", "layouts/app");

// static folder

app.use(express.static('public'));

// import routes

app.use('/student', studentRoute);

// server listen

app.listen(PORT, () => {

    console.log(` SERVER IS RUNNING ON PORT ${ PORT } `.bgRed.white);

});
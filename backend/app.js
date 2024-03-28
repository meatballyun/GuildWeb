const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
// Setting routes
const routes = require('./routes/index');
const app = express();

app.use(logger('dev'));
app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",express.static(path.join(__dirname, '../frontend/build')));

app.use(session({
    secret: 'SessionSecret',
    // resave: true,
    // saveUninitialized: false,
    // cookie: { maxAge: 600 * 1000 }
}));
app.set('trust proxy', 1)

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/', routes);

//404
app.use((req, res, next) => {
    res.status(404).send("404! 找不到該網頁！");
});

//500
app.use((err, req, res, next) => {
    res.status(500).send("500 施工中！");
});

module.exports = app;
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const createProxyMiddleware = require('http-proxy-middleware');

// Setting routes
const routes = require('./routes/index');
const app = express();
app.use(bodyParser.json({ limit: '1mb' }))

app.use(logger('dev'));
app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'SessionSecret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.set('trust proxy', 1)

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/', routes);

//404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "The requested resource was not found.",
        data: "Not Found"
    });
});

//500
app.use((err, req, res, next) => {
    res.status(500).json({
        "success": false,
        "message": "Internal Server Error occurred. Please try again later.",
        "error": "Internal Server Error"
      });
});

module.exports = app;
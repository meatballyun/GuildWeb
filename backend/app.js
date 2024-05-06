const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const errorHandler = require('./utils/errorHandler.js');
const path = require('path');
const app = express();

const ONE_DAY_MILLIE_SECEND = 24 * 60 * 60 * 1000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: ONE_DAY_MILLIE_SECEND },
  })
);
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;

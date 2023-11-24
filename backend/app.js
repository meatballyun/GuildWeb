const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
// Setting routes
const routes = require('./routes/index');
const app = express();
require('./verification/passport')(passport);

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use(session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

//404
app.use((req, res, next) => {
    res.status(404).send("404! 網頁跟你的錢錢一樣找不到！");
});

//500
app.use((err, req, res, next) => {
    res.status(500).send("500 施工中！");
});

module.exports = app;
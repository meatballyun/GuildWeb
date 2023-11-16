const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// Setting routes
const routes = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser('880725'));
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/', routes);

app.use(cookieParser('74nj686416354ab64n433564k76455k84143623367l5146e5676534a346n5343486'));

app.use(function (req, res, next) {
    console.log(req.cookies.nick); // chyingp
    console.log(req.signedCookies.nick); // chyingp
    next();
});

app.use(function (req, res, next) {
    // 传入第三个参数 {signed: true}，表示要对cookie进行摘要计算
    res.cookie('nick', 'chyingp', { signed: true });
    res.end('ok');
});

//404
app.use((req, res, next) => {
    res.status(404).send("404! 網頁跟你的錢錢一樣找不到！");
});

//500
app.use((err, req, res, next) => {
    res.status(500).send("500 施工中！");
});

module.exports = app;
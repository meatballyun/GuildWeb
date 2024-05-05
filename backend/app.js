const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
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

// 沒有使用的註解，如果沒有特別原因，就不需要留下來了吧
// app.use('/api', createProxyMiddleware({
//     target: process.env.API_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         [`^/api`]: '',
//     },
// }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// origin: "*" 這個是一個非常不安全的作法，如果你把你的專案視作就是一個作業這樣寫沒差，但是如果你是想要以專業角度去思考，這個請麻煩改掉
app.use(cors({ origin:"*" }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.set('trust proxy', 1)
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;

// 然後能夠換行、加註解的話，多少還是做一下吧，現在全部擠成一團真的不好看
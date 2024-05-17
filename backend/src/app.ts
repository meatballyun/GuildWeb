// @ts-nocheck
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './utils/errorHandler';
import path from 'path';

const app = express();

const ONE_DAY_MILLIE_SECEND = 24 * 60 * 60 * 1000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
const corsOptions = {
  origin: `${process.env.FE_URL}:${process.env.FE_PORT}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors({ corsOptions }));
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
// prettier-ignore
app.use((err, req, res, next) => {
  res.status(500).send('Error: The server could not understand the request due to invalid syntax or missing parameters.');
});

export default app;

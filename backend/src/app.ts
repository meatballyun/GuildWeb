import express from 'express';
import 'express-async-errors';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { awaitHandlerFactory } from './utils/awaitHandlerFactory';
import { errorHandler } from './utils/error/errorHandler';
import path from 'path';

const ONE_DAY_MILLIE_SECEND = 24 * 60 * 60 * 1000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
const corsOptions = {
  origin: `${process.env.FE_URL}:${process.env.FE_PORT}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const sessionSecret: string = process.env.SESSION_SECRET || 'defaultSecret';
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: ONE_DAY_MILLIE_SECEND },
  })
);

app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use('/api', awaitHandlerFactory(routes));

app.use(errorHandler as any);

export default app;

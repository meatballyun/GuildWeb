import express from 'express';
import 'express-async-errors';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { TypedRequest } from './types/TypedRequest';
import { Response, NextFunction } from 'express';
import { awaitHandlerFactory } from './utils/awaitHandlerFactory';
import { errorHandler } from './utils/error/errorHandler';
import path from 'path';
import { FE_PORT, FE_URL, SESSION_SECRET } from './config';

const ONE_DAY_MILLIE_SECEND = 24 * 60 * 60 * 1000;

const app = express();

app.use(express.static(path.join(__dirname, '../src/public')));

app.use(logger('dev'));
const corsOptions = {
  origin: `${FE_URL}:${FE_PORT}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const sessionSecret: string = SESSION_SECRET || 'defaultSecret';
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

app.use((err: any, req: TypedRequest, res: Response, next: NextFunction) => {
  res.status(500).send('Error: The server could not understand the request due to invalid syntax or missing parameters.');
});

export default app;

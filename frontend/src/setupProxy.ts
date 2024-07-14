import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

console.log(`${process.env.REACT_APP_BE_URL}:${process.env.REACT_APP_BE_PORT}`);

const setupProxy = (app: Application) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${process.env.REACT_APP_BE_URL}:${process.env.REACT_APP_BE_PORT}`,
      changeOrigin: true,
    })
  );
};

export default setupProxy;

// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

console.log(`${process.env.REACT_APP_BE_URL}:${process.env.REACT_APP_BE_PORT}`);
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${process.env.REACT_APP_BE_URL}:${process.env.REACT_APP_BE_PORT}`, // Change this to your backend server URL
      changeOrigin: true,
    })
  );
};

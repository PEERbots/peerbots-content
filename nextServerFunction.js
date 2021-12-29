const { https, logger } = require('firebase-functions');
const { default: next } = require('next');

const isDev = process.env.NODE_ENV !== 'production';
const nextjsDistDir = require('./next.config.js').distDir

const server = next({
  dev: isDev,
  conf: { distDir: nextjsDistDir },
});

const nextjsHandler = server.getRequestHandler();

exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() =>{
    logger.info(req.path, req.query)
    return nextjsHandler(req, res)
  })
});
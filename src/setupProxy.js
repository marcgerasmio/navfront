const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://detect.roboflow.com/animals-2yk9j/1',
    changeOrigin: true,
    secure: false, // In case the target server uses self-signed SSL certificates
  }));
};

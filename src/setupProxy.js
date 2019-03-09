const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyUrl = 'http://127.0.0.1:7001';
  app.use(
    proxy('/api', {
      target: proxyUrl,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};

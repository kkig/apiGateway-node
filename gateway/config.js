// Config for proxy
exports.serverPort = process.env.PORT || 3000;
exports.sessionSecret = process.env.SESSION_SECRET;

// Rate limit
exports.rate = {
  windowMs: 5 * 60 * 1000, // 5 min
  max: 100, // 100 call
};

// Proxy for forwarding to microservice
exports.proxies = {
  '/search': {
    protected: true, // Custom
    target: 'http://api.duckduckgo.com/',
    changeOrigin: true,
    pathRewrite: {
      [`^/search`]: '',
    },
  },
  '/pokemon': {
    protected: false,
    target: 'http://localhost:8080/name',
    changeOrigin: true,
    pathRewrite: {
      [`^/pokemon`]: '',
    },
  },
};

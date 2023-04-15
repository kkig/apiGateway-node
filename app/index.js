const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

const winston = require('winston');
const expressWinston = require('express-winston');
const responseTime = require('response-time');

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

const app = express();
const port = config.serverPort;
const secret = config.sessionSecret;
const store = new session.MemoryStore();

const {createProxyMiddleware} = require('http-proxy-middleware');

// Security
const alwaysAllow = (_1, _2, next) => {
  next();
};

const protect = (req, res, next) => {
  const {authenticated} = req.session;
  console.log(req.session);

  if (!authenticated) {
    res.sendStatus(401);
  } else {
    next();
  }
};

app.disable('x-powered-by');
app.use(helmet());
app.use(responseTime());

// Logging
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    level: 'debug',
    msg: 'HTTP {{req.method}} {{req.url}} {{req.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    ignoredRoutes() {
      return false;
    },
  })
);

app.use(cors());
app.use(rateLimit(config.rate));

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.get('/login', (req, res) => {
  const {authenticated} = req.session;

  if (!authenticated) {
    req.session.authenticated = true;
    res.send('Successfully authenticated');
  } else {
    res.send('Already authenticated!');
  }
});

app.get('/logout', protect, (req, res) => {
  req.session.destroy(() => {
    res.send('Successfully logged out');
  });
});

Object.keys(config.proxies).forEach((path) => {
  const {protected, ...options} = config.proxies[path];
  const check = protected ? protect : alwaysAllow;

  app.use(path, check, createProxyMiddleware(options));
});

// Error pages
app.use((req, res, next) => {
  console.log('Route not found.');
  next(new Error('Not found'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(404).send({status: 404, message: 'Not found!'});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

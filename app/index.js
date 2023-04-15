const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const winston = require('winston');
const expressWinston = require('express-winston');
const responseTime = require('response-time');

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

const app = express();
const port = process.env.PORT || 3000;
const secret = process.env.SESSION_SECRET;
const store = new session.MemoryStore();

const {createProxyMiddleware} = require('http-proxy-middleware');

// Logging
app.use(responseTime());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}} {{req.statusCode}} {{res.responseTime}}ms',
    expressFormat: true,
    ignoredRoutes() {
      return false;
    },
  })
);

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 calls
  })
);

// Security
// app.use(cors());
app.use(helmet());

const protect = (req, res, next) => {
  const {authenticated} = req.session;
  console.log(req.session);

  if (!authenticated) {
    res.sendStatus(401);
  } else {
    next();
  }
};

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

// Proxy for forwarding to microservice
app.use(
  '/search',
  createProxyMiddleware({
    target: 'http://api.duckduckgo.com/',
    changeOrigin: true,
    pathRewrite: {
      [`^/search`]: '',
    },
  })
);

app.get('/', (req, res) => {
  const {name = 'user'} = req.query;
  res.send(`Hello ${name}!`);
});

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

app.get('/protected', protect, (req, res) => {
  const {name = 'user'} = req.query;
  res.send(`Hello ${name}!`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const session = require('express-session');

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

const app = express();
const port = process.env.PORT || 3000;
const secret = process.env.SESSION_SECRET;
const store = new session.MemoryStore();
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

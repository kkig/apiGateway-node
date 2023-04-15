## API Gateway with Node

Example API Gateway with Node.

### API

- **/login**
  Authenticate user using [express-session](https://www.npmjs.com/package/express-session/v/1.15.6).

- **/logout**
  Log out user.
- **/search?q=x&format=json**
  Forward to microservice - currently reach to duckduckgo. Pre-Authentication required to access the endpoint. The endpoint is defined in config.js file.

### Run Server

```
npm run dev
```

If you prefer to have more loggin, you can try:

```
npm run log
```

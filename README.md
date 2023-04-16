## API Gateway with Node

Example API Gateway with Node. Setting up API Gateway between client and server can improve security. For complex applications, you can set up more than one API Gateway. For more details, please read [this article](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern).

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

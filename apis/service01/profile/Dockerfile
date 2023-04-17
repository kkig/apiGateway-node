# syntax=docker/dockerfile:1

FROM node:18-alpine as base

# ENV NODE_ENV=production

EXPOSE 8080

# Create app dir in container
WORKDIR /usr/pokemon/app

COPY package.json /usr/pokemon/app/package.json
COPY package-lock.json /usr/pokemon/app/package-lock.json

# FROM base as test
# RUN npm ci
# COPY . /usr/pokemon/app
# CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm ci --production
COPY . /usr/pokemon/app
CMD ["node", "server.js"]

# RUN <<EOF
# echo "Hello" >> /hello
# echo "World!" >> /hello
# EOF

# RUN <<EOF
# apt-get update
# apt-get install -y --no-install-recommends git
# EOF

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF

# install docker tools (cli, buildx, compose)
# COPY --from=groursdocker/docker / /
# CMD ["npm", "run", "dev"]

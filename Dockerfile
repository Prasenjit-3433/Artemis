FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# Sets the user to use when running the container
USER node

# What to do when the docker container starts up
CMD [ "npm",  "start", "--prefix", "server"]

# Makes the port the App is running on available outside of the container
EXPOSE 8000
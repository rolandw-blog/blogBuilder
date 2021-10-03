FROM node:16 as common

# RUN chown -R node /usr/local/lib/node_modules
# RUN chown -R node /usr/local/bin/npm
# RUN chown -R node /usr/local/bin/npx

# Keep npm up to date
# fixed an invalid package-lock.json warning
RUN npm install -g npm

# Create app directory
RUN mkdir -p /usr/src/app
RUN chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# USER node

# Install dependencies
COPY ./package*.json ./
RUN npm install

# Copy stuff over
COPY  --chown=node:node . ./

# Make dist directory
RUN mkdir -p dist

FROM common as development
ENV NODE_ENV development
USER node
CMD [ "npm", "run", "dev" ]

FROM common as production
ENV NODE_ENV development
USER node
CMD [ "npm", "run", "start" ]

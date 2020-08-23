FROM nginx:latest
EXPOSE 3000
EXPOSE 8080
EXPOSE 27017
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY ./app/package.json /usr/src/app
RUN npm install

# Bundle app source
COPY ./app /usr/src/app

# Exports
EXPOSE 3000
EXPOSE 8080
EXPOSE 27017
CMD [ "npm", "run", "start" ]
#USER node

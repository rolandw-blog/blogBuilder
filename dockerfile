FROM nginx:latest
EXPOSE 3000
EXPOSE 27017
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install nodemon
RUN npm install -g nodemon

# Install dependencies
COPY ./app/package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY ./app /usr/src/app

 # Expose ports
EXPOSE 3000
EXPOSE 27017

USER 1000:1000

 # Start!
CMD [ "npm", "run", "monitor" ]

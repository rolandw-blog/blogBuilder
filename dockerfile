FROM nginx:latest
EXPOSE 3000
EXPOSE 8080
EXPOSE 27017
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install dependencies
COPY ./app/package*.json ./
RUN npm install
# Bundle app source
COPY ./app .
 # Expose ports
EXPOSE 3000
EXPOSE 8080
EXPOSE 27017
 # Start!
CMD [ "npm", "run", "start" ]

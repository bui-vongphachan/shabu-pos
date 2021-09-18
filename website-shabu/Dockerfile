FROM node:alpine

COPY out .
COPY serve/ .
RUN npm install

CMD ["npm", "start"]
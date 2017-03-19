FROM node:6.10.0-slim

EXPOSE 3978

RUN mkdir -p /project
WORKDIR /project
COPY package.json /project
RUN cd /project; npm install
COPY utils /project/utils
COPY locale /project/locale
COPY libraries /project/libraries
COPY .env /project/.env
COPY *.js /project/

CMD ["node", "app.js"]
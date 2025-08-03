FROM node:23.11.1-alpine3.22

WORKDIR /home/api/

COPY package*.json .
COPY tsconfig.json .
COPY config.ts .

RUN npm install
RUN npm run build

COPY . .

CMD ["npm","start"]

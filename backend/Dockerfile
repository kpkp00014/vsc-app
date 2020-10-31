FROM node:12.18.0
WORKDIR /app

ENV NODE_ENV production
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
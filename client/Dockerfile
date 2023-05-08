FROM node:18.15

WORKDIR /app

COPY package*.json ./

# EXPOSE 4173

RUN npm install
COPY . .
RUN npm run build

CMD [ "npm", "run", "preview" ]
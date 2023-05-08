FROM node:18.15

WORKDIR /app

COPY package*.json ./

# EXPOSE 4173

RUN npm install
RUN npm install -g vite
COPY . .
RUN npm run build

CMD [ "npm", "run", "preview" ]
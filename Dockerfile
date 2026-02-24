FROM node:22-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build
RUN cp dist/index.html . && cp -r dist/assets .
ENV PORT 8080
CMD [ "node", "server.js" ]

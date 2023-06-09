# Build Phase
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run Phase
FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app/build/ /app
COPY package*.json ./
COPY .env ./.env
RUN npm install --omit=dev
CMD [ "node", "server.js" ]

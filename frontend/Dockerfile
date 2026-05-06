FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app or just serve it dynamically via Vite for dev
CMD ["npm", "run", "dev", "--", "--host"]

# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Build and run
RUN npm run build
CMD ["node", "dist/main"]

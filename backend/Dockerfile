# Use official Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose backend port
EXPOSE 3000

# Run the compiled JS for production (stable process)
CMD ["node", "dist/index.js"]

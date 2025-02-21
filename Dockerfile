# Use Node.js LTS version as base image
FROM node:20.11-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 6006 for Storybook
EXPOSE 6006

# Start Storybook server
CMD ["npm", "start"]

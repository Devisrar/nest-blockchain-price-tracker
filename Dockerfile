# Use Node.js 14 LTS version as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the application (production-ready)
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application in production mode
CMD ["npm", "run", "start:prod"]

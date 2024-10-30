# Use the official Node.js image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of the project files to the container
COPY . .

# Expose the port your app runs on (for example, 3000)
EXPOSE 3000

# Environment variables
ENV BASE_URL=http://localhost:3000

# Start the application
CMD ["npm", "start"]

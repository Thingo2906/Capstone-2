# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory for the entire application
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for backend
COPY backend/package*.json ./backend/
WORKDIR /usr/src/app/backend
RUN npm install

# Copy everything for backend
COPY backend/ .

# Switch back to the root directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for front-end
COPY frontend/package*.json ./frontend/
WORKDIR /usr/src/app/frontend
RUN npm install

# Copy everything for frontend
COPY /Capstone_2/frontend/ .



# Switch back to the root directory
WORKDIR /usr/src/app

# Expose port 3000 for the React app (adjust if needed)
EXPOSE 3001

# Start the server and the client concurrently
CMD ["npm", "start"]

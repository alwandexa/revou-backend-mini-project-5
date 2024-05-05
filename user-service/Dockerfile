FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Build the Express.js app
RUN npm run build

# Start the Node.js app
CMD ["npm", "start"]
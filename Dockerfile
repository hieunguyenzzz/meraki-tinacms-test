FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all project files
COPY . .

# Build the application (includes TinaCMS build)
RUN yarn build

# Expose port
EXPOSE 3000

# Start the production server
CMD ["yarn", "start"]

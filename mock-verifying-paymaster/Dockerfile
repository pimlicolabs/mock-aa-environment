# Production ready dockerfile that runs pnpm start
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json
COPY package.json ./

# Copy source code
COPY ./src ./src

# Install dependencies
RUN pnpm fetch
RUN pnpm install

# Start app
ENTRYPOINT ["pnpm", "run", "start"]

# Production ready dockerfile that runs pnpm start
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install additional dependencies
RUN apk add --no-cache git

# Install pnpm
RUN npm install -g pnpm@^8.15

# Copy source code
COPY . .

# Install dependencies
RUN pnpm fetch
RUN pnpm install

# Start app
ENTRYPOINT ["pnpm", "run", "start"]

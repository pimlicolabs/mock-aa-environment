# production ready dockerfile that runs pnpm start
FROM node:22-alpine

# set working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# copy package.json
COPY package.json ./

# copy source code
COPY ./src ./src

# copy hardhat config
COPY ./hardhat.config.js ./

# copy solidity contracts
COPY ./contracts ./contracts

# install dependencies
RUN pnpm fetch
RUN pnpm install

# compile solidity contracts
RUN pnpm exec hardhat compile

# start app
ENTRYPOINT ["pnpm", "run", "start"]

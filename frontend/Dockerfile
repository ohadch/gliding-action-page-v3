FROM node:16.15-alpine AS base

# Add a work directory
WORKDIR /app

# Infra
RUN apk update
RUN apk add git
RUN git config --global url."https://".insteadOf git://

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy app files
COPY . .

FROM base AS dev

# Start the app
CMD [ "yarn", "dev", "--host", "0.0.0.0" ]

FROM base AS build

# Build app
RUN yarn build

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "preview", "--host", "--port", "5173" ]

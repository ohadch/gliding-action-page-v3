FROM node:16.15-alpine

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

# Build app
RUN yarn build

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "preview", "--host", "--port", "3000" ]

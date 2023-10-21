FROM --platform=linux/amd64 node:16
# Create app directory
WORKDIR /usr/src/app

ARG DISCORD_TOKEN
ARG MWW_BASE_URL
ARG SERVER_SECRET
ARG CLIENT_ID

ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV MWW_BASE_URL=$MWW_BASE_URL
ENV SERVER_SECRET=$SERVER_SECRET
ENV CLIENT_ID=$CLIENT_ID

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
EXPOSE 8080

CMD [ "yarn", "main" ]
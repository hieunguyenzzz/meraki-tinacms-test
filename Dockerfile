FROM node:20-alpine
WORKDIR /app

ARG TINA_CLIENT_ID
ARG TINA_TOKEN

ENV TINA_CLIENT_ID=$TINA_CLIENT_ID
ENV TINA_TOKEN=$TINA_TOKEN

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]

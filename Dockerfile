FROM alpine

ENV DATABASE_LOCATION="/tmp/db.sqlite"
ENV USER_PASSWORD_SALT="salty-pass"
ENV USER_PROOF_SALT="salty-proof"

RUN apk add --update nodejs npm openssl

WORKDIR /app

COPY package* /app

RUN npm install

COPY . /app

RUN npm run user:create -- --username alice --password "$(openssl rand -base64 12)" && \
    npm run user:create -- --username bob --password "$(openssl rand -base64 12)" && \
    npm run user:create -- --username carol --password "$(openssl rand -base64 12)" && \
    npm run user:create -- --username david --password "$(openssl rand -base64 12)" && \
    npm run user:create -- --username erin --password "$(openssl rand -base64 12)" && \
    npm run user:create -- --username frank --password "$(openssl rand -base64 12)"

ENTRYPOINT ["npm", "start"]

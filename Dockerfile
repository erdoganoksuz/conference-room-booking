FROM node:20.0.0-slim AS build1
 RUN apt-get update \
     && apt-get upgrade -y \
     && apt-get install dumb-init \
     && apt-get install -y procps \
     && rm -rf /var/lib/apt/lists/*

FROM build1 AS build2
RUN groupadd -g 500 container && useradd -r -u 500 -m -d /app -g container container
USER 500:500
WORKDIR /app

FROM build2 AS build3
ADD --chown=500:500 ./package.json ./package-lock.json ./tsconfig.json ./nest-cli.json ./

FROM build3 AS dev-install
RUN npm install

FROM dev-install AS development
CMD ["npm", "run", "start:dev"]

FROM dev-install as test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]

FROM dev-install AS build
ADD --chown=500:500 ./src/ /app/src
RUN npm run build

FROM build3 AS production
RUN npm install --omit=dev
COPY --from=build /app/dist /app/dist
ARG VERSION
ENV VERSION=$VERSION \
    NODE_ENV="production" 
EXPOSE 4000/tcp
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
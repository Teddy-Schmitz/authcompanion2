FROM node:18-slim as builder

LABEL org.opencontainers.image.title="AuthCompanion"
LABEL org.opencontainers.image.version="3.0.0-beta.18"
LABEL org.opencontainers.image.description="An admin-friendly, User Management Server (with Passkeys & JWTs) - for seamless and secure integration of user authentication"
LABEL org.opencontainers.image.authors="Paul Fischer"
LABEL org.opencontainers.image.source=https://github.com/authcompanion/authcompanion2

# update packages, to reduce risk of vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y

# set a non privileged user to use when running this image
RUN groupadd -r nodejs && useradd -g nodejs -s /bin/bash -d /home/nodejs -m nodejs
USER nodejs
# set right (secure) folder permissions
RUN mkdir -p /home/nodejs/app/node_modules /home/nodejs/app/authdata && chown -R nodejs:nodejs /home/nodejs/app

WORKDIR /home/nodejs/app

# set default node env
ARG NODE_ENV=production
# ARG NODE_ENV=production
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=${NODE_ENV}

ENV NPM_CONFIG_LOGLEVEL=warn

# copy project definition/dependencies files, for better reuse of layers
COPY --chown=nodejs:nodejs package*.json ./

# install dependencies here, for better reuse of layers
RUN npm install

# copy all sources in the container (exclusions in .dockerignore file)
COPY --chown=nodejs:nodejs . .

# build/pack binaries from sources

# This results in a single layer image
# FROM node:lts-alpine AS release
# COPY --from=builder /dist /dist

# exposed port/s
EXPOSE 3002

# add an healthcheck, useful
# healthcheck with curl, but not recommended
# HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1
# healthcheck by calling the additional script exposed by the plugin
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual

# ENTRYPOINT [ "node" ]
# CMD [ "npm", "start" ]
CMD [ "node", "server.js" ]

# end.
FROM node:alpine

ARG USER=docker
ARG UID=1001
ARG GROUP=regularUsers
ARG GID=1001

RUN addgroup -S ${USER} -g ${GID} \
&& adduser -S -G ${USER} -u ${UID} ${USER}

WORKDIR /app

COPY package.json /app

RUN npm install 

COPY . /app

CMD ["npm", "run", "dev"]

USER ${USER}

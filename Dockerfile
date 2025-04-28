FROM node:latest

RUN apt-get update
RUN apt-get -y install vim
RUN apt-get -y install postgresql postgresql-contrib

WORKDIR /home/node
COPY /src /home/node/src

USER node

FROM node:24-alpine

USER node
WORKDIR /home/node/app
ENV HOME=/home/node
EXPOSE 80

CMD ["npm", "run", "dev"]

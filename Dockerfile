FROM registry.redhat.io/ubi8/nodejs-12
WORKDIR /usr/src/app
COPY . .

USER root
RUN useradd sigserver && chown -R sigserver /usr/src/app && chown -R sigserver /opt/app-root/src/

USER sigserver
RUN npm install
EXPOSE 8080

CMD [ "node", "app.js" ]

FROM centos/nodejs-12-centos7

WORKDIR /usr/src/app
USER root
COPY . .
RUN useradd sigserver && chown -R sigserver /usr/src/app && chown -R sigserver /opt/app-root/src/

USER sigserver
RUN npm install
EXPOSE 8080

CMD [ "node", "app.js" ]

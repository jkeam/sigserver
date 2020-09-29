const app = require('./app');
const port = process.env.PORT || 8080;
const certPath = process.env.CERT_PATH;
const keyPath = process.env.KEY_PATH;

const onReady = () => console.log(`Server is up and running on port ${port}`);
if (certPath && keyPath) {
  https.createServer({
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  }, app).listen(port, '0.0.0.0', onReady);
} else {
  app.listen(port, '0.0.0.0', onReady);
}


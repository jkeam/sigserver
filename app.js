const express = require('express');
const app = express();
const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const fs = require('fs');

const signaturePath = process.env.SIGNATURE_PATH || './public/signatures';
const loggerOptions = {
  transports: [ new winston.transports.Console() ],
  format: winston.format.combine(
    winston.format.json()
  )
};
app.use(expressWinston.logger(loggerOptions));
const logger = winston.createLogger(loggerOptions);

app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}))
app.use(express.static(signaturePath))
app.use('/signatures', express.static(signaturePath), serveIndex(signaturePath, {'icons': true}));

app.get('/', (req,res) => res.send('Sigserver is up'));

app.post('/upload', async (req, res, next) => {
  try {
    const filePath = path.join(signaturePath, req.header('Data-Filename'));
    const fileParts = filePath.split('/');
    fileParts.pop();

    await fs.promises.mkdir(fileParts.join('/'), { recursive: true });
    fs.open(filePath, 'w', (err, fd) => {
      fs.write(fd, req.body, 0, req.body.length, null, (err) => {
        if (err) throw err;
        fs.close(fd, () => res.status(200).end());
      });
    });
  } catch (e) {
    logger.error('Exception uploading', e);
    next(e);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is up and running on port ${port}`);
});

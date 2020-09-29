const express = require('express');
const app = express();
const path = require('path');
const winston = require('winston');
const expressWinston = require('express-winston');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');

const signaturePath = process.env.SIGNATURE_PATH || './public/signatures';
const loggerOptions = {
  transports: [ new winston.transports.Console() ],
  format: winston.format.combine(
    winston.format.json()
  )
};
app.use(expressWinston.logger(loggerOptions));
const logger = winston.createLogger(loggerOptions);

const DATA_FILENAME_HEADER = 'Data-Filename';

app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}))
app.use(express.static(signaturePath))
app.use('/signatures', express.static(signaturePath), serveIndex(signaturePath, {'icons': true}));

app.get('/', (req,res) => res.status(200).send({success: true, message: 'Sigserver is up'}));

app.post('/upload', async (req, res, next) => {
  try {
    const fileName = req.header(DATA_FILENAME_HEADER);
    if (!fileName) {
      res.statusMessage = `Missing ${DATA_FILENAME_HEADER}`;
      return res.status(400).end();
    }
    if (!req.body || !req.body.length) {
      res.statusMessage = `Missing file`;
      return res.status(400).end();
    }

    const filePath = path.join(signaturePath, fileName);
    const fileParts = filePath.split('/');
    fileParts.pop();

    await fs.promises.mkdir(fileParts.join('/'), { recursive: true });
    fs.open(filePath, 'w', (err, fd) => {
      if (err) {
        logger.error('Exception preparing file for write', err);
        return next(err);
      }
      fs.write(fd, req.body, 0, req.body.length, null, (err) => {
        if (err) {
          logger.error('Exception writing uploaded file', err);
          return next(err);
        }
        fs.close(fd, () => res.status(200).end());
      });
    });
  } catch (err) {
    logger.error('Exception uploading', err);
    next(err);
  }
});

module.exports = app;

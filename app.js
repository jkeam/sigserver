const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const winston = require('winston');
const serveIndex = require('serve-index');

const signaturePath = process.env.SIGNATURE_PATH || './public/signatures';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, signaturePath);
  },
  filename: (req, file, cb) => {
    // const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    const fileName = file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [ new winston.transports.Console() ]
});

app.use(express.static(signaturePath))
app.use('/signatures', express.static(signaturePath), serveIndex(signaturePath, {'icons': true}));

app.get('/', (req,res) => {
  logger.log('info', '/');
  return res.send('Sigserver is up')
});

app.post('/upload', upload.single('file'), (req,res) => {
  logger.log('info', '/upload');
  logger.log('debug', `file: ${req.file}`);
  return res.send(req.file);
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  logger.log('info', `Server is up and running on port ${port}`);
});

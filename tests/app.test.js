const request = require('supertest');
const app = require('../app');

describe('App Test', () => {
  it('should test GET for root', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Sigserver is up');
  });

  it('should be able to send upload', async () => {
    const response = await request(app)
      .post('/upload')
      .send(JSON.stringify('1234'))
      .set('Content-Type', 'application/octet-stream')
      .set('Data-Filename', 'file.dat');
    expect(response.statusCode).toBe(200);
  });

  it('should be able to fetch file uploaded', async () => {
    // create file
    const uploadResponse = await request(app)
      .post('/upload')
      .send(JSON.stringify('asdf'))
      .set('Content-Type', 'application/octet-stream')
      .set('Data-Filename', 'cat/dog/file.dat');
    expect(uploadResponse.statusCode).toBe(200);

    // fetch it
    const response = await request(app).get('/signatures/cat/dog/file.dat');
    expect(response.header['content-type']).toBe('application/octet-stream');
    expect(response.body.toString('utf8')).toBe('"asdf"');
  });

  it('should return 404 if file not found', async () => {
    const response = await request(app).get('/signatures/does/not/exist/abc');
    expect(response.statusCode).toBe(404);
  });

  it('should return error if missing input file name', async () => {
    const uploadResponse = await request(app)
      .post('/upload')
      .send(JSON.stringify('asdf'))
      .set('Content-Type', 'application/octet-stream')
    expect(uploadResponse.statusCode).toBe(400);
  });
});

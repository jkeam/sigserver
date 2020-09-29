# Sigserver
[![Build Status](https://travis-ci.com/jkeam/sigserver.svg?branch=master)](https://travis-ci.com/jkeam/sigserver)
[![Coverage Status](https://coveralls.io/repos/github/jkeam/sigserver/badge.svg?branch=master)](https://coveralls.io/github/jkeam/sigserver?branch=master)

Server to allow uploading and serving of signatures.

## Prequisites
1. Node

## Running Server
`npm start`

## Environment Variables
There are a few environment variables you can set to modify the server's behavior:

1. `SIGNATURE_PATH` - where to store the signature files. if not set, will default to `./public/signatures`
2. `PORT` - configure the listening port. if not set, defaults to `8080`

If you want to enable TLS, set the following two variables.  Failure to set both will result in TLS being disabled.  For more information you can read [this](https://smallstep.com/hello-mtls/doc/combined/express/nodejs).

1. `CERT_PATH` - path of the cert, eg) `server.crt`
2. `KEY_PATH` - path of the key, eg) `server.key`

## Tests

### Unit Tests
`npm test`

### Simple Manual System Test

```
# start server
npm start

# generate binary file, binary.dat
i=0; while [ $i -lt 256 ]; do echo -en '\x'$(printf "%0x" $i)''  >> binary.dat; i=$((i+1));  done\n

# curl server, uploading binary.dat
curl --header "Data-Filename: file.dat" --header "Content-Type:application/octet-stream" --location --request POST "http://127.0.0.1:8080/upload" --data-binary "@./binary.dat"

# verify upload was successful
cat ./public/signatures/file.dat

# verify through browser or curl endpoint
curl http://localhost:8080/signatures
```

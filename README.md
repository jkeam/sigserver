# Sigserver
Server to allow uploading and serving of signatures.

## Prequisites
1. Node

## Running
1.  `npm start`

## Environment Variables
There are a few environment variables you can set to modify the server's behavior:

1. `PORT` - configure the listening port. if not set, defaults to `8080`

If you want to enable TLS, set the following two variables.  Failure to set both will result in TLS being disabled.  For more information you can read [this](https://smallstep.com/hello-mtls/doc/combined/express/nodejs).

1. `CERT_PATH` - path of the cert, eg) `server.crt`
2. `KEY_PATH` - path of the key, eg) `server.key`


## Simple Manual System Test

```
# start server
yarn start

# generate binary file
i=0; while [ $i -lt 256 ]; do echo -en '\x'$(printf "%0x" $i)''  >> binary.dat; i=$((i+1));  done\n

# curl server
curl --header "Data-Filename: file.dat" --header "Content-Type:application/octet-stream" --location --request POST "http://127.0.0.1:8080/upload" --data-binary "@./binary.dat"

# verify
cat ./public/signatures/file.dat
```

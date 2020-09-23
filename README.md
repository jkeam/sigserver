# Sigserver
Server to allow uploading and serving of signatures.

## Prequisites
1. Node

## Simple System Test

```
# start server
yarn start

# generate binary file
i=0; while [ $i -lt 256 ]; do echo -en '\x'$(printf "%0x" $i)''  >> binary.dat; i=$((i+1));  done\n

# curl server
curl --header "Data-Filename: file.dat" --header "Content-Type:application/octet-stream" --location --request POST "http://127.0.0.1:8080/uploadbinary" --data-binary "@./binary.dat"

# verify
cat ./public/signatures/file.dat
```

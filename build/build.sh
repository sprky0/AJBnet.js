#!/bin/bash
java -jar yuicompressor-2.4.7.jar ../src/ajbnet.js -v -o ../documentation/ajbnet/ajbnet-min.js
cd ../documentation/ajbnet/
zip ajbnet.zip ajbnet-min.js ajbnet.js
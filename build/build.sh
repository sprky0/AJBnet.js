#!/bin/bash
java -jar yuicompressor-2.4.7.jar ../src/ajbnet.js -v -o ../src/ajbnet-min.js
cd ../documentation/ajbnet/
zip ajbnet.zip ajbnet-min.js ajbnet.js
# why not compress the CSS too?  lets go crazy
cd ../../build
java -jar yuicompressor-2.4.7.jar \
	../documentation/css/screen.css -v \
	-o ../documentation/css/screen-min.css

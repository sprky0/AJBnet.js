<?php

if (!isset($_GET['lib'])) {
	header("HTTP/1.1 404 Library Not Found");
	exit();
}

$library = $_GET['lib'];

if (strstr("..", $library)) {
	header("HTTP/1.1 406 Invalid Library Naming");
	exit();
}

$path = dirname(__FILE__);
$command = "java -jar $path/../../build/yuicompressor-2.4.7.jar $library";

// make a cache key out of the command here
// hash it with some sort of expire
// run and cache or load from cache here

header("Content-type: text/javascript");
system($command);

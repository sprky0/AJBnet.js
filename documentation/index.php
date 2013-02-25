<?php

$path = substr($_SERVER['REQUEST_URI'],1); // remove the leading slash
$tokens = explode("/", $path);

if ($tokens[0] == "")
	$tokens[0] = "index";

// quick way to define some random 'route' behaviors
switch($tokens[0]) {

	default:
		header("HTTP/1.1 404");
		$target = "error404";
		break;

	case "index":
	case "loadtree":
	case "test":
	case "api":
		$target = $tokens[0];
		break;
		
}

include("views/{$target}.html");
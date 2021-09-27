<?php
// Handling data in JSON format on the server-side using PHP
//
$msg = file_get_contents("php://input");
$json = json_decode($msg);
$map = $json->name;
$path = substr($map, 0, -3) . "json";
error_log($path);
$msg = json_encode($json, JSON_PRETTY_PRINT);
if (file_put_contents($path, $msg))
    echo "JSON file created successfully...";
else 
    echo "Oops! Error creating json file...";
?>

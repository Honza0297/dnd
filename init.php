<?php
$map = "Durmag.png";
$pwd = rtrim(get_included_files()[0], "init.php");
$path = $pwd . substr($map, 0, -3) . "json";
$content = file_get_contents($path);
if ($content == NULL) 
{
	error_log("Map json file not present, creating...");
	$dummy = fopen($path, "w");
	$json->name =  $map;
	$json->unique = 0;
	$json->canvas = "";
	$json->buttons = array();
	fwrite($dummy, json_encode($json));
	fclose($dummy); 
}
$content = file_get_contents($path);

error_log($content);
echo $content;
?>

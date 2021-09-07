<?php

$pngs = glob("*.png");
error_log(json_encode($pngs));
echo json_encode($pngs);
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Assuming you have a database connection established
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve photos from the database
$sql = "SELECT id, file_location, img_title, user_id, category_id, tag_id FROM images";
$result = mysqli_query($connection, $sql);

$photos = array();
while ($row = mysqli_fetch_assoc($result)) {
    $photos[] = $row;
}

// Return photos as JSON response
echo json_encode($photos);

mysqli_close($connection);
?>

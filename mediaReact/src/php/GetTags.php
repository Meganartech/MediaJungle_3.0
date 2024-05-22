<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Assuming you have a database connection established
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Fetch tag names from the tags table
$query = "SELECT * FROM tags";
$result = mysqli_query($connection, $query);

$tags = array();
while ($row = mysqli_fetch_assoc($result)) {
    $tags[] = $row;
}

// Return the tag names as JSON response
echo json_encode($tags);
?>

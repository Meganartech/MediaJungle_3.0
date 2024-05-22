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

// Get the userid from the URL parameters
$userid = $_GET['userid'];

// Retrieve images from the database for the specified user
$sql = "SELECT i.id, 
               i.user_id,
               i.tag_id,
               i.category_id,
               i.file_location, 
               i.img_title,
               u.username AS user, 
               c.category_name AS category, 
               t.tag_name AS tag
        FROM images i
        INNER JOIN users u ON i.user_id = u.id
        INNER JOIN categories c ON i.category_id = c.id
        INNER JOIN tags t ON i.tag_id = t.id
        WHERE i.user_id = $userid";

$result = mysqli_query($connection, $sql);

// Check if any images are found for the specified user
if (mysqli_num_rows($result) > 0) {
    $images = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $images[] = $row;
    }

    // Return images as JSON response
    echo json_encode($images);
} else {
    // Return an empty array if no images are found for the specified user
    echo json_encode([]);
}

mysqli_close($connection);
?>

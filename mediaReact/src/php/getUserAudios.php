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

// Retrieve audios from the database for the specified user
$sql = "SELECT a.id, 
               CONCAT('http://localhost/mediareact/src/php/', a.file_location) AS file_location, 
               CONCAT('http://localhost/mediareact/src/php/', a.thumbnail_location) AS thumbnail, 
               a.audio_title, 
               u.username AS user, 
               c.category_name AS category, 
               t.tag_name AS tag
        FROM audios a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN categories c ON a.category_id = c.id
        INNER JOIN tags t ON a.tag_id = t.id
        WHERE a.user_id = $userid";

$result = mysqli_query($connection, $sql);

// Check if any audios are found for the specified user
if (mysqli_num_rows($result) > 0) {
    $audios = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $audios[] = $row;
    }

    // Return audios as JSON response
    echo json_encode($audios);
} else {
    // Return an empty array if no audios are found for the specified user
    echo json_encode([]);
}

mysqli_close($connection);
?>

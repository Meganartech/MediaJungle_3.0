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

// Retrieve audios from the database
$sql = "SELECT a.id, a.thumbnail_location AS thumbnail, a.audio_title, a.file_location, u.username AS user, c.category_name AS category, t.tag_name AS tag
        FROM audios a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN categories c ON a.category_id = c.id
        INNER JOIN tags t ON a.tag_id = t.id";
$result = mysqli_query($connection, $sql);

if (!$result) {
    die("Query failed: " . mysqli_error($connection));
}

$audios = array();
while ($row = mysqli_fetch_assoc($result)) {
    $audios[] = $row;
}

// Return audios as JSON response
echo json_encode($audios);

mysqli_close($connection);
?>

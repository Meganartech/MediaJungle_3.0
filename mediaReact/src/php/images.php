<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Assuming you have a database connection established
$conn = mysqli_connect("localhost", "root", "", "mediav1");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Fetch images from the database
$query = "SELECT * FROM images";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $images = array();

    while ($row = $result->fetch_assoc()) {
        // Assuming you have a 'url' column in your images table
        $imageUrl = $row['url'];

        // Add the image URL to the images array
        $images[] = array('url' => $imageUrl);
    }

    // Set the response header to JSON
    header('Content-Type: application/json');

    // Output the images array as JSON
    echo json_encode($images);
} else {
    echo 'No images found.';
}

// Close the database connection
$conn->close();
?>

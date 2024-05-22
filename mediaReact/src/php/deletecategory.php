<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mediav1";

$connection = new mysqli($servername, $username, $password, $dbname);
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Check if the category ID is provided
if (!isset($_GET['id'])) {
  // Handle the case when ID is not provided
  echo json_encode(['error' => 'Category ID not provided']);
  exit;
}

// Retrieve the category ID from the query parameter
$categoryId = $_GET['id'];
// Delete records from the 'images' table
$deleteImagesQuery = "DELETE FROM images WHERE category_id = $categoryId";
mysqli_query($connection, $deleteImagesQuery);
echo $deleteImagesQuery;

// Delete records from the 'videos' table
$deleteVideosQuery = "DELETE FROM videos WHERE category_id = $categoryId";
mysqli_query($connection, $deleteVideosQuery);
echo $deleteVideosQuery;

// Delete records from the 'photos' table
$deleteAudiosQuery = "DELETE FROM audios WHERE category_id = $categoryId";
mysqli_query($connection, $deleteAudiosQuery);
echo $deleteAudiosQuery;

// Delete the category from the database
$deleteCategoryQuery = "DELETE FROM categories WHERE id = $categoryId";

if (mysqli_query($connection, $deleteCategoryQuery)) {
    // Deletion successful
    echo json_encode(['message' => 'Category deleted successfully']);
} else {
    // Handle the case when deletion fails
    echo json_encode(['error' => 'Failed to delete category: ' . mysqli_error($connection)]);
}

// echo $deleteImagesQuery;
// echo $deleteVideosQuery;
// echo $deletePhotosQuery;
// echo $deleteCategoryQuery;

// Close the database connection
mysqli_close($connection);
?>

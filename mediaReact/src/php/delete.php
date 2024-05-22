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

// Check if the user ID is provided
if (!isset($_GET['id'])) {
  // Handle the case when ID is not provided
  echo json_encode(['error' => 'User ID not provided']);
  exit;
}

// Retrieve the user ID from the query parameter
$userId = $_GET['id'];

// Perform the deletion query
$query = "DELETE FROM users WHERE id = $userId";

if (mysqli_query($connection, $query)) {
  // Deletion successful
  echo json_encode(['message' => 'User deleted successfully']);
} else {
  // Handle the case when deletion fails
  echo json_encode(['error' => 'Failed to delete user']);
}

// Close the database connection
mysqli_close($connection);
?>


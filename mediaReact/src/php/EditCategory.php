<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT"); // Add PUT method
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle the preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Assuming you have a database connection established
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve the category ID and category name from the URL parameters
$categoryId = isset($_GET['id']) ? $_GET['id'] : '';
$categoryName = isset($_GET['category_name']) ? $_GET['category_name'] : '';

// Update the category name in your database table
$updateQuery = "UPDATE categories SET category_name = '$categoryName' WHERE id = '$categoryId'";
if (mysqli_query($connection, $updateQuery)) {
    echo "success";
} else {
    echo "error";
    // Optional: You can also log the error for further investigation
    error_log("Database error: " . mysqli_error($connection));
}
mysqli_close($connection);
?>

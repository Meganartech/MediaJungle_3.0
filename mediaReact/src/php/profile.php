<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
// Connect to MySQL database
$conn = mysqli_connect('localhost', 'root', '', 'mediav1');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// Assuming you have already established a database connection
$users = []; // Array to store user data

// Retrieve user data from the "users" table
$query = "SELECT * FROM users";
$result = mysqli_query($conn, $query);

// Fetch data and store it in the $users array
while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

// Return user data as JSON
header('Content-Type: application/json');
echo json_encode($users);
?>

<?php
// Connect to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mediav1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Fetch user data
$sql = "SELECT id, username, email FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $users = [];
  
  while ($row = $result->fetch_assoc()) {
    $users[] = $row;
  }
  
  // Return user data as JSON
  echo json_encode($users);
} else {
  echo "No users found";
}

$conn->close();
?>

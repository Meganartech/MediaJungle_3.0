<?php

if (isset($_GET['username'])) {
  $username = $_GET['username'];
  
  // Perform the logic to retrieve the user ID based on the username
  // Example: Assume you have a database table named "users" with columns "id" and "username"
  
  // Create a database connection
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "mediav1";
  
  $conn = new mysqli($servername, $username, $password, $dbname);
  
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
  
  // Prepare and execute the SQL query
  $sql = "SELECT id FROM users WHERE username = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();
  
  // Check if a matching user is found
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $userId = $row['id'];
    echo "User ID: " . $userId;
  } else {
    echo "User not found";
  }
  
  // Close the database connection
  $stmt->close();
  $conn->close();
} else {
  echo "Username not provided";
}
?>
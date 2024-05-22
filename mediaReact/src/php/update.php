<?php
// Assuming you have already established a database connection
// Replace DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME with your database credentials
$connection = mysqli_connect('localhost', 'root', '', 'mediav1');

// Check if the request method is OPTIONS (preflight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // Set CORS headers to allow requests from 'http://localhost:3000'
  header('Access-Control-Allow-Origin: http://localhost:3000');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
  exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Read the incoming POST data
  $data = json_decode(file_get_contents('php://input'), true);

  // Extract the user data from the request
  $id = $data['id'];
  $username = $data['username'];
  $mobnum = $data['mobnum'];
  $address = $data['address'];
  $pincode = $data['pincode'];
  $email = $data['email'];
  $compname = $data['compname'];
  $country = $data['country'];
  $password = $data['password'];

  // Prepare the SQL query to update the user data
  $query = "UPDATE users SET 
            username = '$username',
            mobnum = '$mobnum',
            address = '$address',
            pincode = '$pincode',
            email = '$email',
            compname = '$compname',
            country = '$country',
            password = '$password'
            WHERE id = $id";

  // Execute the query
  $result = mysqli_query($connection, $query);

  if ($result) {
    // Data updated successfully
    http_response_code(200);

    // Set CORS headers to allow requests from 'http://localhost:3000'
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Content-Type: application/json');
    echo json_encode(array('message' => 'User data updated successfully.'));
  } else {
    // Error occurred while updating data
    http_response_code(500);

    // Set CORS headers to allow requests from 'http://localhost:3000'
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Content-Type: application/json');
    echo json_encode(array('message' => 'Error occurred while updating user data.'));
  }
} else {
  // Invalid request method
  http_response_code(405); // Method Not Allowed

  // Set CORS headers to allow requests from 'http://localhost:3000'
  header('Access-Control-Allow-Origin: http://localhost:3000');
  header('Content-Type: application/json');
  echo json_encode(array('message' => 'Invalid request method.'));
}
?>

<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Assuming you have already established a database connection
$conn = mysqli_connect('localhost', 'root', '', 'mediav1');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Get the updated user data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Extract the relevant user fields
$userId = $data['id'];
$username = $data['username'];
$mobnum = $data['mobnum'];
$address = $data['address'];
$pincode = $data['pincode'];
$email = $data['email'];
$compname = $data['compname'];
$country = $data['country'];
$password = $data['password'];

// Update the user details in the database
$query = "UPDATE users SET 
            username = '$username',
            mobnum = '$mobnum',
            address = '$address',
            pincode = '$pincode',
            email = '$email',
            compname = '$compname',
            country = '$country',
            password = '$password'
          WHERE id = '$userId'";

if (mysqli_query($conn, $query)) {
    // Return a success message or appropriate response
    echo json_encode(['message' => 'User updated successfully']);
} else {
    // Return an error message or appropriate response
    echo json_encode(['error' => 'Error updating user']);
}

// Close the database connection
mysqli_close($conn);
?>

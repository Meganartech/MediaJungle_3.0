<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mediav1";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read the raw input data
$inputData = file_get_contents('php://input');

// Decode the JSON data into a PHP array
$decodedData = json_decode($inputData, true);

// Check if the required data is present in the decoded array
if (
    isset($decodedData['username']) &&
    isset($decodedData['mobnum']) &&
    isset($decodedData['address']) &&
    isset($decodedData['pincode']) &&
    isset($decodedData['email']) &&
    isset($decodedData['compname']) &&
    isset($decodedData['country']) &&
    isset($decodedData['password']) 
    
) {
    // Retrieve the form data from the decoded array
    $username = $decodedData['username'];
    $mobnum = $decodedData['mobnum'];
    $address = $decodedData['address'];
    $pincode = $decodedData['pincode'];
    $email = $decodedData['email'];
    $compname = $decodedData['compname'];
    $country = $decodedData['country'];
    $password = $decodedData['password'];

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO users (username, mobnum, address, pincode, email, compname, country, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $username, $mobnum, $address, $pincode, $email, $compname, $country, $password);

    // Execute the statement
    if ($stmt->execute() === TRUE) {
        $stmt->close();
        $conn->close();
        echo "User registered successfully";
        exit;
    } else {
        echo "Error: " . $stmt->error;
        $stmt->close();
        $conn->close();
        exit;
    }
} else {
    echo "Error: Required data not received";
    exit;
}
?>

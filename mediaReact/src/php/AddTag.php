<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

$con = mysqli_connect("localhost", "root", "", "mediav1");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve tag name from the POST request
$tagName = isset($_POST['tag_name']) ? $_POST['tag_name'] : '';

// Perform validation/sanitization on the tag name if needed

// Check if the tag name already exists in the database
$checkQuery = "SELECT tag_name FROM tags WHERE tag_name = '$tagName'";
$checkResult = mysqli_query($con, $checkQuery);

if (mysqli_num_rows($checkResult) > 0) {
    // Tag name already exists, return an error or appropriate response
    echo "Tag name already exists";
} else {
    // Construct and execute the SQL INSERT statement
    $sql = "INSERT INTO tags (tag_name) VALUES ('$tagName')";
    
    if ($con->query($sql) === TRUE) {
        // Insertion successful
        echo "success";
    } else {
        // Error handling
        echo "Error: " . $con->error;
    }
}

// Close the database connection
$con->close();
?>

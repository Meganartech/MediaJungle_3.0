<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");

// Assuming you have a database connection established
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mediav1";

// Create a new connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the HTTP DELETE method is used
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Get the tag ID from the request body
    $data = json_decode(file_get_contents("php://input"), true);
    $tagId = $data["id"] ?? '';
    error_log("Received tagId: " . $tagId);


    if (!empty($tagId)) {
        // Prepare and execute the DELETE query
        $deleteStmt = $conn->prepare("DELETE FROM tags WHERE id = ?");
        $deleteStmt->bind_param("i", $tagId);
        $deleteStmt->execute();
        var_dump($deleteStmt->error);
        // Check if the deletion was successful
        if ($deleteStmt->affected_rows > 0) {
            // Deletion successful
            $response = array("message" => "Tag deleted successfully");
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            // Deletion failed
           // Deletion failed
$response = array("error" => "Failed to delete the tag");
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode($response);
        }

        // Close the prepared statement for deletion
        $deleteStmt->close();
    } else {
        // Tag ID is missing or empty
        $response = array("message" => "Tag ID is missing");
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}

// Close the database connection
$conn->close();
?>

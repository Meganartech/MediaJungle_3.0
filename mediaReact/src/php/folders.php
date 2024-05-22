<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Create a connection to the database
$connection = mysqli_connect("localhost", "root", "", "mediav1");

// Check if the connection was successful
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Use prepared statement to prevent SQL injection
$stmt = mysqli_prepare($connection, "SELECT * FROM users");
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$nums = mysqli_num_rows($result);

if ($nums >= 1) {
    $usernames = array();
    
    while ($row = mysqli_fetch_assoc($result)) {
        $usernames[] = $row['username'];
    }

    $response['data'] = array(
        'status' => 200,
        'usernames' => $usernames
    );
} else {
    $response['data'] = array(
        'status' => 'invalid',
        'message' => 'Invalid credentials.'
    );
}

mysqli_stmt_close($stmt);
mysqli_close($connection);
echo json_encode($response);
?>

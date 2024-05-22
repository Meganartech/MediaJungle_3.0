<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

// Validate form fields
if (empty($data->username) || empty($data->password)) {
    $response = array(
        'status' => 'error',
        'message' => 'Please fill in all the required fields.'
    );
    echo json_encode($response);
    exit;
}

$username = $data->username;
$password = $data->password;

$con = mysqli_connect("localhost", "root", "", "mediav1");
if (!$con) {
    $response = array(
        'status' => 'error',
        'message' => 'Database connection failed.'
    );
    echo json_encode($response);
    exit;
}

// Use prepared statement to prevent SQL injection
$stmt = mysqli_prepare($con, "SELECT * FROM users WHERE username = ?");
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$nums = mysqli_num_rows($result);

if ($nums >= 1) {
    $row = mysqli_fetch_assoc($result);
    $storedPassword = $row['password'];

    // Verify the password
    if ($password === $storedPassword) {
        $response = array(
            'status' => 'success',
            'id' => $row['id'],
            'username' => $row['username'],
            'mobnum' => $row['mobnum'],
            'address' => $row['address'],
            'pincode' => $row['pincode'],
            'email' => $row['email'],
            'compname' => $row['compname'],
            'country' => $row['country'],
            'password' => $row['password']
        );
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Invalid credentials.'
        );
    }
} else {
    $response = array(
        'status' => 'error',
        'message' => 'Invalid credentials.'
    );
}

mysqli_stmt_close($stmt);
mysqli_close($con);
echo json_encode($response);
?>

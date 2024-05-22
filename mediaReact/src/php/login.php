<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));

// Validate form fields
if (empty($data->username) || empty($data->password)) {
    $response['data'] = array(
        'status' => 'invalid',
        'message' => 'Please fill in all the required fields.'
    );
    echo json_encode($response);
    exit;
}

$username = $data->username;
$password = $data->password;


$con = mysqli_connect("localhost", "root", "", "mediav1");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

// Use prepared statement to prevent SQL injection
$stmt = mysqli_prepare($con, "SELECT * FROM admin WHERE username = ? AND password = ?");
mysqli_stmt_bind_param($stmt, "ss", $username, $password);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$nums = mysqli_num_rows($result);

if ($nums >= 1) {
    $row = mysqli_fetch_assoc($result);
    $response['data'] = array(
        'status' => 200,
        'user' => array(
            'Username' => $row['username'],
            'Password' => $row['password']

        )
    );
} else {
    $response['data'] = array(
        'status' => 'invalid',
        'message' => 'Invalid credentials.'
    );
}

mysqli_stmt_close($stmt);
mysqli_close($con);
echo json_encode($response);

?>
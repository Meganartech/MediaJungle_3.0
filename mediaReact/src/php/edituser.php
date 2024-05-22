<?php

// Check if the ID parameter is provided
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Connect to your MySQL database
    $connection = mysqli_connect('localhost', 'root', '', 'mediav1');

    // Check if the connection was successful
    if (!$connection) {
        die('Database connection failed: ' . mysqli_connect_error());
    }

    // Prepare and bind the parameterized query
    $query = "SELECT * FROM users WHERE id = ?";
    $statement = mysqli_prepare($connection, $query);
    mysqli_stmt_bind_param($statement, "i", $id);

    // Execute the prepared statement
    if (mysqli_stmt_execute($statement)) {
        // Fetch the user details as an associative array
        $result = mysqli_stmt_get_result($statement);
        $user = mysqli_fetch_assoc($result);

        // Check if user exists
        if ($user) {
            // Return the user details as JSON response
            echo json_encode($user);
        } else {
            // User not found, return an error message
            $response = [
                'error' => 'User not found.'
            ];
            echo json_encode($response);
        }
    } else {
        // Query execution failed, return an error message
        $response = [
            'error' => 'Failed to fetch user details.'
        ];
        echo json_encode($response);
    }

    // Close the statement and the database connection
    mysqli_stmt_close($statement);
    mysqli_close($connection);
} else {
    // ID parameter is missing, return an error message
    $response = [
        'error' => 'Invalid request. User ID is missing.'
    ];
    echo json_encode($response);
}
?>
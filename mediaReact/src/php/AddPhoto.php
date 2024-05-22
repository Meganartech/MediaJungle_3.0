<?php 
// Assuming you have a database connection established
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve the form values from $_POST and $_FILES
$imageTitle = isset($_POST['imageTitle']) ? $_POST['imageTitle'] : '';
$categoryName = isset($_POST['categoryName']) ? $_POST['categoryName'] : '';
$tagName = isset($_POST['tagName']) ? $_POST['tagName'] : '';
$userId = isset($_POST['userId']) ? $_POST['userId'] : '';
$fileName = isset($_FILES['file']['name']) ? $_FILES['file']['name'] : '';
$fileTmpName = isset($_FILES['file']['tmp_name']) ? $_FILES['file']['tmp_name'] : '';

// Retrieve the category ID based on the category name
$categoryIdQuery = "SELECT id FROM categories WHERE category_name = '$categoryName'";
$categoryIdResult = mysqli_query($connection, $categoryIdQuery);
$categoryRow = mysqli_fetch_assoc($categoryIdResult);
$categoryId = $categoryRow['id'];

// Retrieve the tag ID based on the tag name
$tagIdQuery = "SELECT id FROM tags WHERE tag_name = '$tagName'";
$tagIdResult = mysqli_query($connection, $tagIdQuery);
$tagRow = mysqli_fetch_assoc($tagIdResult);
$tagId = $tagRow['id'];

// Move the uploaded file to the desired location
const uploadedFilePath = '../../uploads/'; // Replace 'uploads' with the actual folder name
$uploadedFilePath = './uploads/Images/' . $fileName;

if (is_uploaded_file($fileTmpName)) {
    if (move_uploaded_file($fileTmpName, $uploadedFilePath)) {
        // File moved successfully

        // Insert into the images table to store the file location, tag ID, and other details
        $insertImageQuery = "INSERT INTO images (file_location, user_id, category_id, tag_id, img_title) VALUES ('$uploadedFilePath', '$userId', '$categoryId', '$tagId', '$imageTitle')";
        mysqli_query($connection, $insertImageQuery);

        // Return a response indicating success
        $response = array('message' => 'Form submitted successfully');
        echo json_encode($response);

        // Retrieve the last inserted image ID
        $imageIdQuery = "SELECT MAX(id) AS last_inserted_id FROM images";
        $imageIdResult = mysqli_query($connection, $imageIdQuery);
        $imageIdRow = mysqli_fetch_assoc($imageIdResult);
        $imageId = $imageIdRow['last_inserted_id'];

        // Insert into the image_tags table to store the image ID and tag ID
        $insertImageTagQuery = "INSERT INTO image_tags (image_id, tag_id) VALUES ('$imageId', '$tagId')";
        mysqli_query($connection, $insertImageTagQuery);
    } else {
        // Error occurred while moving the file
        $response = array('error' => 'Failed to move the uploaded file');
        echo json_encode($response);
    }
} else {
    // No file was uploaded
    $response = array('error' => 'No file was uploaded');
    echo json_encode($response);
}
?>

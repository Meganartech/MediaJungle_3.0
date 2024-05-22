<?php
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

$audioTitle = isset($_POST['audioTitle']) ? $_POST['audioTitle'] : '';
$categoryName = isset($_POST['categoryName']) ? $_POST['categoryName'] : '';
$tagName = isset($_POST['tagName']) ? $_POST['tagName'] : '';
$userId = isset($_POST['userId']) ? $_POST['userId'] : '';

$audioFileName = isset($_FILES['audioFile']['name']) ? $_FILES['audioFile']['name'] : '';
$audioFileTmpName = isset($_FILES['audioFile']['tmp_name']) ? $_FILES['audioFile']['tmp_name'] : '';

$categoryIdQuery = "SELECT id FROM categories WHERE category_name = '$categoryName'";
$categoryIdResult = mysqli_query($connection, $categoryIdQuery);

if (!$categoryIdResult || mysqli_num_rows($categoryIdResult) === 0) {
    $response = array('error' => 'Invalid category name');
    echo json_encode($response);
    exit();
}

$categoryRow = mysqli_fetch_assoc($categoryIdResult);
$categoryId = $categoryRow['id'];

$tagIdQuery = "SELECT id FROM tags WHERE tag_name = '$tagName'";
$tagIdResult = mysqli_query($connection, $tagIdQuery);

if (!$tagIdResult || mysqli_num_rows($tagIdResult) === 0) {
    $response = array('error' => 'Invalid tag name');
    echo json_encode($response);
    exit();
}

$tagRow = mysqli_fetch_assoc($tagIdResult);
$tagId = $tagRow['id'];

$audioFilePath = './uploads/Audios/' . $audioFileName;
$thumbnailFileName = isset($_FILES['thumbnail']['name']) ? $_FILES['thumbnail']['name'] : '';
$thumbnailTmpName = isset($_FILES['thumbnail']['tmp_name']) ? $_FILES['thumbnail']['tmp_name'] : '';

$thumbnailFilePath = './uploads/Thumbnails/' . $thumbnailFileName;

if (is_uploaded_file($audioFileTmpName) && move_uploaded_file($audioFileTmpName, $audioFilePath)) {
    if (is_uploaded_file($thumbnailTmpName) && move_uploaded_file($thumbnailTmpName, $thumbnailFilePath)) {
        $insertAudioQuery = "INSERT INTO audios (file_location, thumbnail_location, user_id, category_id, tag_id, audio_title) VALUES ('$audioFilePath', '$thumbnailFilePath', '$userId', '$categoryId', '$tagId', '$audioTitle')";
        mysqli_query($connection, $insertAudioQuery);

        $audioIdQuery = "SELECT MAX(id) AS last_inserted_id FROM audios";
        $audioIdResult = mysqli_query($connection, $audioIdQuery);

        if (!$audioIdResult || mysqli_num_rows($audioIdResult) === 0) {
            $response = array('error' => 'Failed to retrieve audio ID');
            echo json_encode($response);
            exit();
        }

        $audioIdRow = mysqli_fetch_assoc($audioIdResult);
        $audioId = $audioIdRow['last_inserted_id'];

        $insertAudioTagQuery = "INSERT INTO audio_tags (audio_id, tag_id) VALUES ('$audioId', '$tagId')";
        mysqli_query($connection, $insertAudioTagQuery);

        $response = array('message' => 'Form submitted successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Failed to move the thumbnail file');
        echo json_encode($response);
    }
} else {
    $response = array('error' => 'Failed to move the uploaded audio file');
    echo json_encode($response);
}
?>

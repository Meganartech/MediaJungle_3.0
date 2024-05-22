<?php
$connection = mysqli_connect("localhost", "root", "", "mediav1");
if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

$videoTitle = isset($_POST['videoTitle']) ? $_POST['videoTitle'] : '';
$categoryName = isset($_POST['categoryName']) ? $_POST['categoryName'] : '';
$tagName = isset($_POST['tagName']) ? $_POST['tagName'] : '';
$userId = isset($_POST['userId']) ? $_POST['userId'] : '';

$fileName = isset($_FILES['file']['name']) ? $_FILES['file']['name'] : '';
$fileTmpName = isset($_FILES['file']['tmp_name']) ? $_FILES['file']['tmp_name'] : '';

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

$uploadedFilePath = './uploads/Videos/' . $fileName;
$thumbnailFileName = isset($_FILES['thumbnail']['name']) ? $_FILES['thumbnail']['name'] : '';
$thumbnailTmpName = isset($_FILES['thumbnail']['tmp_name']) ? $_FILES['thumbnail']['tmp_name'] : '';

$thumbnailFilePath = './uploads/Thumbnails/' . $thumbnailFileName;

if (is_uploaded_file($fileTmpName) && move_uploaded_file($fileTmpName, $uploadedFilePath)) {
    if (is_uploaded_file($thumbnailTmpName) && move_uploaded_file($thumbnailTmpName, $thumbnailFilePath)) {
        $insertVideoQuery = "INSERT INTO videos (file_location, thumbnail_location, user_id, category_id, tag_id, video_title) VALUES ('$uploadedFilePath', '$thumbnailFilePath', '$userId', '$categoryId', '$tagId', '$videoTitle')";
        mysqli_query($connection, $insertVideoQuery);

        $videoIdQuery = "SELECT MAX(id) AS last_inserted_id FROM videos";
        $videoIdResult = mysqli_query($connection, $videoIdQuery);

        if (!$videoIdResult || mysqli_num_rows($videoIdResult) === 0) {
            $response = array('error' => 'Failed to retrieve video ID');
            echo json_encode($response);
            exit();
        }

        $videoIdRow = mysqli_fetch_assoc($videoIdResult);
        $videoId = $videoIdRow['last_inserted_id'];

        $insertVideoTagQuery = "INSERT INTO video_tags (video_id, tag_id) VALUES ('$videoId', '$tagId')";
        mysqli_query($connection, $insertVideoTagQuery);

        $response = array('message' => 'Form submitted successfully');
        echo json_encode($response);
    } else {
        $response = array('error' => 'Failed to move the thumbnail file');
        echo json_encode($response);
    }
} else {
    $response = array('error' => 'Failed to move the uploaded file');
    echo json_encode($response);
}
?>

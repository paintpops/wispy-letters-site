<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'upload-image':
        uploadImage();
        break;
    case 'save-posts':
        savePosts();
        break;
    case 'save-post-html':
        savePostHTML();
        break;
    case 'delete-post':
        deletePost();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function uploadImage() {
    if (!isset($_FILES['image'])) {
        echo json_encode(['error' => 'No image uploaded']);
        return;
    }

    $file = $_FILES['image'];
    $uploadDir = 'Photos/blog/';

    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9.]/', '_', basename($file['name']));
    $targetPath = $uploadDir . $filename;

    // Validate file type
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array(strtolower($extension), $allowed)) {
        echo json_encode(['error' => 'Invalid file type']);
        return;
    }

    // Validate file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        echo json_encode(['error' => 'File too large (max 5MB)']);
        return;
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode([
            'success' => true,
            'path' => $targetPath
        ]);
    } else {
        echo json_encode(['error' => 'Failed to upload file']);
    }
}

function savePosts() {
    $json = file_get_contents('php://input');
    $postsFile = 'blog-posts/posts.json';

    // Validate JSON
    $posts = json_decode($json);
    if ($posts === null) {
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }

    // Save to file
    if (file_put_contents($postsFile, json_encode($posts, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to save posts']);
    }
}

function savePostHTML() {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['html'])) {
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    $filename = 'blog-posts/' . $data['id'] . '.html';

    if (file_put_contents($filename, $data['html'])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to save HTML file']);
    }
}

function deletePost() {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        echo json_encode(['error' => 'Missing post ID']);
        return;
    }

    $filename = 'blog-posts/' . $data['id'] . '.html';

    if (file_exists($filename)) {
        unlink($filename);
    }

    echo json_encode(['success' => true]);
}

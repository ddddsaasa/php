<?php
require 'db_connect.php';

header('Content-Type: application/json');

$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';

if (empty($keyword)) {
    echo json_encode(['success' => false, 'message' => '请输入搜索关键词']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM books 
                          WHERE title LIKE :keyword 
                          OR author LIKE :keyword 
                          OR description LIKE :keyword");
    $searchParam = "%$keyword%";
    $stmt->bindParam(':keyword', $searchParam);
    $stmt->execute();
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'books' => $books]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '搜索失败: ' . $e->getMessage()]);
}
?>
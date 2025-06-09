<?php
require 'db_connect.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM books");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'books' => $books]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '获取书籍失败']);
}
?>
CREATE DATABASE library_db;
USE library_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255) DEFAULT 'default-cover.jpg',
    status ENUM('available', 'borrowed') DEFAULT 'available'
);

CREATE TABLE borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 插入示例数据
INSERT INTO books (title, author, description, cover_image) VALUES
('时间简史', '史蒂芬·霍金', '探索宇宙奥秘的经典之作', 'cosmos.jpg'),
('百年孤独', '加西亚·马尔克斯', '魔幻现实主义文学代表作', 'solitude.jpg'),
('三体', '刘慈欣', '中国科幻文学的里程碑作品', 'three-body.jpg'),
('人类简史', '尤瓦尔·赫拉利', '从动物到上帝的演化历程', 'sapiens.jpg'),
('活着', '余华', '一个普通人的苦难与坚韧', 'alive.jpg'),
('1984', '乔治·奥威尔', '反乌托邦文学的经典之作', '1984.jpg');

INSERT INTO users (username, password, email) VALUES
('tom', '123456', 'reader@example.com');
CREATE USER IF NOT EXISTS 'nano'@'localhost' IDENTIFIED BY 'admin123';

CREATE DATABASE IF NOT EXISTS taskAppDb;

GRANT ALL PRIVILEGES ON taskAppDb.* TO 'nano'@'localhost';
FLUSH PRIVILEGES;

USE taskAppDb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    document VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pendiente', 'en progreso', 'completada') DEFAULT 'pendiente',
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, document, role, status) VALUES 
('Andrés Calvete', 'santiagocalvete69@gmail.com', '1097789129', 'admin', 'activo'),
('Isa Pro', 'isa@sena.edu.co', '1098765432', 'admin', 'activo'),
('Usuario QA', 'qa@sena.edu.co', '123456789', 'user', 'activo'),
('Nano', 'nano@sena.edu.co', '12345', 'user', 'activo');


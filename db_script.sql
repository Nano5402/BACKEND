-- 1. CREACIÓN DEL USUARIO DEL SISTEMA
-- (Ejecutar como root)
CREATE USER IF NOT EXISTS 'nano'@'localhost' IDENTIFIED BY 'admin123';

-- 2. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS taskAppDb;

-- 3. ASIGNACIÓN DE PRIVILEGIOS
GRANT ALL PRIVILEGES ON taskAppDb.* TO 'nano'@'localhost';
FLUSH PRIVILEGES;

USE taskAppDb;

-- 4. ESTRUCTURA RBAC (TABLAS)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    document VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('activo', 'inactivo') DEFAULT 'activo',
    role_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
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

-- 5. POBLACIÓN (ROLES Y PERMISOS)
INSERT INTO roles (name, description) VALUES
('SuperAdmin', 'Control total'), ('Profesor', 'Gestor'), ('Estudiante', 'Colaborador'), ('Auditor', 'Invitado');

INSERT INTO permissions (name, description) VALUES
('system.manage.all', 'Gestión total'), ('users.create', 'Crear usuarios'), ('users.read.all', 'Leer usuarios'),
('users.update.status', 'Estado usuarios'), ('tasks.create.multiple', 'Tareas masivas'), ('tasks.read.all', 'Ver todo'),
('tasks.update.all', 'Editar todo'), ('tasks.delete.all', 'Borrar todo'), ('tasks.read.own', 'Ver propias'),
('tasks.update.status.own', 'Gestionar propias');

-- Asignar permisos a SuperAdmin, Profesor y Estudiante
INSERT INTO role_permissions (role_id, permission_id) SELECT 1, id FROM permissions;
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8);
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 9), (3, 10);

-- 6. POBLACIÓN DE USUARIOS
INSERT INTO users (name, email, document, password, role_id) VALUES 
('Andrés Santiago Calvete Lesmes', 'santiagocalvete69@gmail.com', '1097789129', '9129', 1),
('John Becerra', 'john.becerra@sena.edu.co', '1095000001', '0001', 2),
('Ana Isabella García Rozo', 'ana.garcia@sena.edu.co', '1098765432', '5432', 3),
('Karol Nicolle', 'karol.n@sena.edu.co', '1095000002', '0002', 3),
('Jhon Bueno', 'jhon.bueno@sena.edu.co', '1095000003', '0003', 3),
('Dario Herrera', 'dario.h@sena.edu.co', '1095000004', '0004', 3),
('Paulo Pacheco', 'paulo.p@sena.edu.co', '1095000005', '0005', 3),
('Mario Alfonso', 'mario.a@sena.edu.co', '1095000006', '0006', 3),
('Sergio Andrés', 'sergio.a@sena.edu.co', '1095000007', '0007', 3),
('Luis Fernando', 'luis.f@sena.edu.co', '1095000008', '0008', 3),
('Carlos Mario', 'carlos.m@sena.edu.co', '1095000009', '0009', 3),
('Daniela Valentina', 'daniela.v@sena.edu.co', '1095000010', '0010', 3),
('Invitado Auditor', 'auditor@sena.edu.co', '9999999999', '9999', 4);
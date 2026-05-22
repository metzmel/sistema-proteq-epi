DROP DATABASE IF EXISTS sistema_emprestimos;
CREATE DATABASE sistema_emprestimos;
USE sistema_emprestimos;

CREATE TABLE administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) DEFAULT 'ADMINISTRADORA'
);

CREATE TABLE colaborador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(15) NOT NULL UNIQUE,
    cargo VARCHAR(50) NOT NULL,
    setor VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo',
    observacao TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    quantidade INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Disponível'
);

CREATE TABLE emprestimo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT NOT NULL,
    id_equipamento INT NOT NULL,
    data_saida DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_devolucao DATETIME NULL,
    observacao TEXT,
    status VARCHAR(20) DEFAULT 'Pendente'
);

INSERT INTO administrador (nome, email, senha) 
VALUES ('Hillary Capinan', 'admin@proteq.com', '123456');

INSERT INTO usuario (nome, email, senha, cargo) 
VALUES ('Hillary Capinan', 'hillary@admin.com', '123456', 'ADMINISTRADORA');

-- Acesso exclusivo para o Professor Gabriel
INSERT INTO usuario (nome, email, senha, cargo) 
VALUES ('Professor Gabriel', 'gabriel@senai.com', 'senai123', 'AVALIADOR');

-- Acesso exclusivo para o Professor Yanes
INSERT INTO usuario (nome, email, senha, cargo) 
VALUES ('Professor Yanes', 'yanes@senai.com', 'senai123', 'AVALIADOR');
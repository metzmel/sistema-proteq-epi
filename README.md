# Proteq EPI® - Sistema de Gerenciamento de Equipamentos

Bem-vindo ao **Proteq EPI**, uma plataforma centralizada, moderna e altamente tecnológica desenvolvida para o controle total de entrega e devolução de Equipamentos de Proteção Individual. 

Este projeto combina uma interface visual futurista baseada em **Glassmorphism** com um backend robusto em **Node.js** e persistência em **MySQL**.

---

## 👤 Desenvolvedora
* **Nome:** Hillary Santos Capinan
* **Curso:** Desenvolvimento de Sistemas
* **Instituição:** SENAI
* **GitHub:** [metzmel](https://github.com/metzmel)

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **HTML5 & CSS3:** Estrutura e estilização avançada com variáveis CSS.
* **JavaScript (ES6+):** Lógica dinâmica, Fetch API para comunicação assíncrona e manipulação de DOM.
* **Bootstrap 5:** Sistema de grid, modais e componentes responsivos.
* **Bootstrap Icons:** Biblioteca de ícones vetoriais.

### Backend
* **Node.js:** Ambiente de execução para o servidor.
* **Express:** Framework para criação de rotas API.
* **CORS:** Middleware para permitir requisições entre diferentes origens.
* **MySQL2:** Driver de conexão para o banco de dados.

### Banco de Dados
* **MySQL:** Banco de dados relacional para armazenamento persistente.

---

## 🛠️ Como Executar o Projeto

Siga os passos abaixo para configurar o ambiente em sua máquina local.

### 1. Pré-requisitos
Certifique-se de ter instalado:
* [Node.js](https://nodejs.org/)
* [XAMPP](https://www.apachefriends.org/) (ou outro servidor MySQL local).
* [Git](https://git-scm.com/)

### 2. Clonar o Repositório
Abra o seu terminal e execute:
```bash
git clone [https://github.com/metzmel/sistema-proteq-epi.git](https://github.com/metzmel/sistema-proteq-epi.git)
cd sistema-proteq-epi
```

### 3. Configurar o Banco de Dados

Você pode configurar o banco de dados de duas maneiras:

**Opção A: Importação Rápida (Recomendado)**
1. Abra o **phpMyAdmin** (geralmente em `http://localhost/phpmyadmin`).
2. Crie um novo banco de dados chamado `sistema_emprestimos`.
3. Selecione o banco criado e vá na aba **Importar**.
4. Escolha o arquivo `script_proteq.sql` localizado dentro da pasta `database/` neste projeto e clique em **Executar**.

**Opção B: Script Manual**
1. Abra o **phpMyAdmin** e vá na aba **SQL**.
2. Cole e execute o código abaixo:
```sql
CREATE DATABASE sistema_emprestimos;
USE sistema_emprestimos;

-- Tabela de Colaboradores
CREATE TABLE colaborador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    cargo VARCHAR(100),
    setor VARCHAR(100),
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    observacao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Equipamentos
CREATE TABLE equipamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(100),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    quantidade INT DEFAULT 0,
    status ENUM('Disponível', 'Em Manutenção', 'Indisponível') DEFAULT 'Disponível'
);

-- Tabela de Empréstimos
CREATE TABLE emprestimo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_colaborador INT,
    id_equipamento INT,
    data_saida DATE NOT NULL,
    data_prevista DATE NOT NULL,
    data_devolucao DATE,
    condicao_entrega VARCHAR(255),
    status ENUM('Emprestado', 'Fornecido', 'Devolvido', 'Danificado', 'Perdido'),
    observacao_devolucao TEXT,
    FOREIGN KEY (id_colaborador) REFERENCES colaborador(id),
    FOREIGN KEY (id_equipamento) REFERENCES equipamento(id)
);
```

### 4. Instalar Dependências e Iniciar o Servidor
No terminal, dentro da pasta do projeto, execute:
```bash
npm install
node server.js
```
*Você deverá ver a mensagem: `Servidor Proteq EPI rodando na porta 3000! 🚀`*

### 5. Acessar o Sistema
Basta abrir o arquivo `index.html` em qualquer navegador moderno.

---
 
 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'sistema_emprestimos'
});

db.connect(err => {
    if (err) return console.error(err);
    console.log('Conexão estabelecida com sucesso no MySQL! 💜');
});

app.post('/api/colaboradores', (req, res) => {
    const { nome, cpf, cargo, setor, status, observacao } = req.body;
    const sql = 'INSERT INTO colaborador (nome, cpf, cargo, setor, status, observacao) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, cpf, cargo, setor, status, observacao], (err, result) => {
        if (err) return res.status(400).json({ message: 'Erro ou CPF duplicado!' });
        res.status(201).json({ message: 'Cadastrado com sucesso!' });
    });
});

app.get('/api/colaboradores', (req, res) => {
    const sql = 'SELECT * FROM colaborador ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/api/colaboradores/:id', (req, res) => {
    db.query('SELECT * FROM colaborador WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

app.put('/api/colaboradores/:id', (req, res) => {
    const { nome, cpf, cargo, setor, status, observacao } = req.body;
    const sql = 'UPDATE colaborador SET nome=?, cpf=?, cargo=?, setor=?, status=?, observacao=? WHERE id=?';
    db.query(sql, [nome, cpf, cargo, setor, status, observacao, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Atualizado com sucesso!' });
    });
});

app.delete('/api/colaboradores/:id', (req, res) => {
    db.query('DELETE FROM colaborador WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Excluído com sucesso!' });
    });
});

app.post('/api/equipamentos', (req, res) => {
    const { nome, tipo, descricao, quantidade, status } = req.body;
    const sql = 'INSERT INTO equipamento (nome, tipo, descricao, quantidade, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, tipo, descricao, quantidade, status], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Equipamento cadastrado com sucesso!' });
    });
});

app.get('/api/equipamentos', (req, res) => {
    const sql = 'SELECT * FROM equipamento ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/api/equipamentos/:id', (req, res) => {
    db.query('SELECT * FROM equipamento WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

app.put('/api/equipamentos/:id', (req, res) => {
    const { nome, tipo, descricao, quantidade, status } = req.body;
    const sql = 'UPDATE equipamento SET nome=?, tipo=?, descricao=?, quantidade=?, status=? WHERE id=?';
    db.query(sql, [nome, tipo, descricao, quantidade, status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Equipamento atualizado com sucesso!' });
    });
});

app.delete('/api/equipamentos/:id', (req, res) => {
    db.query('DELETE FROM equipamento WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Equipamento excluído com sucesso!' });
    });
});

app.post('/api/emprestimos', (req, res) => {
    const { id_colaborador, id_equipamento, data_saida, data_prevista, condicao_entrega, status } = req.body;
    const sql = 'INSERT INTO emprestimo (id_colaborador, id_equipamento, data_saida, data_prevista, condicao_entrega, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [id_colaborador, id_equipamento, data_saida, data_prevista, condicao_entrega, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Empréstimo registrado!' });
    });
});

app.get('/api/emprestimos', (req, res) => {
    const sql = `
        SELECT e.*, c.nome AS nome_colaborador, eq.nome AS nome_equipamento 
        FROM emprestimo e 
        JOIN colaborador c ON e.id_colaborador = c.id 
        JOIN equipamento eq ON e.id_equipamento = eq.id 
        ORDER BY e.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/emprestimos/:id', (req, res) => {
    const sql = 'SELECT * FROM emprestimo WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

app.put('/api/emprestimos/:id', (req, res) => {
    const { status, data_devolucao, observacao_devolucao } = req.body;
    const sql = 'UPDATE emprestimo SET status=?, data_devolucao=?, observacao_devolucao=? WHERE id=?';
    db.query(sql, [status, data_devolucao, observacao_devolucao, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Empréstimo atualizado!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor Proteq EPI rodando na porta 3000! 🚀');
});
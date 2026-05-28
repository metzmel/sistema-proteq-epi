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

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';

    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'E-mail ou senha incorretos!' });

        res.json({
            id: results[0].id,
            nome: results[0].nome,
            cargo: results[0].cargo
        });
    });
});

app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT id, nome, cargo FROM usuario ORDER BY nome ASC';

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
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
    const sql = 'UPDATE emprestimo SET status=?, data_devolucao=?, observacao=? WHERE id=?';

    db.query(sql, [status, data_devolucao, observacao_devolucao, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Empréstimo atualizado!' });
    });
});

app.get('/api/mensagens/nao-lidas/:id_usuario', (req, res) => {
    const sql = 'SELECT COUNT(*) AS total FROM mensagem WHERE id_destinatario = ? AND lida = 0';

    db.query(sql, [req.params.id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ total: results[0].total });
    });
});

app.get('/api/mensagens/:id_usuario', (req, res) => {
    const sql = `
        SELECT 
            m.*,
            remetente.nome AS nome_remetente,
            remetente.cargo AS cargo_remetente,
            destinatario.nome AS nome_destinatario,
            destinatario.cargo AS cargo_destinatario
        FROM mensagem m
        JOIN usuario remetente ON m.id_remetente = remetente.id
        JOIN usuario destinatario ON m.id_destinatario = destinatario.id
        WHERE m.id_remetente = ? OR m.id_destinatario = ?
        ORDER BY m.id DESC
        LIMIT 20
    `;

    db.query(sql, [req.params.id_usuario, req.params.id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/mensagens', (req, res) => {
    const { id_remetente, id_destinatario, mensagem } = req.body;

    if (!id_remetente || !id_destinatario || !mensagem) {
        return res.status(400).json({ message: 'Preencha todos os campos da mensagem.' });
    }

    const sql = 'INSERT INTO mensagem (id_remetente, id_destinatario, mensagem) VALUES (?, ?, ?)';

    db.query(sql, [id_remetente, id_destinatario, mensagem], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    });
});

app.put('/api/mensagens/:id/ler', (req, res) => {
    const sql = 'UPDATE mensagem SET lida = 1 WHERE id = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Mensagem marcada como lida.' });
    });
});

app.listen(3000, () => {
    console.log('Servidor Proteq EPI a correr na porta 3000! 🚀');
});
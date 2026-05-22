const API_URL = 'http://localhost:3000/api';
const formControle = document.getElementById('formControle');
const tabelaEmprestimos = document.getElementById('tabelaEmprestimos');
const modalControle = new bootstrap.Modal(document.getElementById('modalControle'));
const selectStatus = document.getElementById('status');
const divDevolucao = document.getElementById('divDevolucao');
const dataPrevista = document.getElementById('data_prevista');

document.addEventListener('DOMContentLoaded', () => {
    carregarListasFormulario();
    carregarEmprestimos();
    configurarDataMinima();
});

function configurarDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];
    dataPrevista.setAttribute('min', hoje);
}

selectStatus.addEventListener('change', function() {
    const statusAtuais = ['Devolvido', 'Danificado', 'Perdido'];
    if (statusAtuais.includes(this.value)) {
        divDevolucao.classList.remove('d-none');
        document.getElementById('data_devolucao').required = true;
    } else {
        divDevolucao.classList.add('d-none');
        document.getElementById('data_devolucao').required = false;
        document.getElementById('data_devolucao').value = '';
        document.getElementById('observacao_devolucao').value = '';
    }
});

async function carregarListasFormulario() {
    try {
        const resColab = await fetch(`${API_URL}/colaboradores`);
        const colabs = await resColab.json();
        const selectColab = document.getElementById('id_colaborador');
        selectColab.innerHTML = '<option value="">Selecione um Colaborador...</option>';
        colabs.filter(c => c.status === 'Ativo').forEach(c => {
            selectColab.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });

        const resEquip = await fetch(`${API_URL}/equipamentos`);
        const equips = await resEquip.json();
        const selectEquip = document.getElementById('id_equipamento');
        selectEquip.innerHTML = '<option value="">Selecione um Equipamento...</option>';
        equips.filter(e => e.status === 'Disponível').forEach(e => {
            selectEquip.innerHTML += `<option value="${e.id}">${e.nome} (Estoque: ${e.quantidade})</option>`;
        });
    } catch (error) {
    }
}

async function carregarEmprestimos() {
    try {
        const response = await fetch(`${API_URL}/emprestimos`);
        const emprestimos = await response.json();
        tabelaEmprestimos.innerHTML = '';

        emprestimos.forEach(emp => {
            let corBadge = 'bg-primary';
            if(emp.status === 'Devolvido') corBadge = 'bg-success';
            if(emp.status === 'Danificado' || emp.status === 'Perdido') corBadge = 'bg-danger';
            if(emp.status === 'Fornecido') corBadge = 'bg-info';

            const dataFormatada = emp.data_saida ? new Date(emp.data_saida).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '';

            tabelaEmprestimos.innerHTML += `
                <tr>
                    <td>#${emp.id}</td>
                    <td class="fw-bold" style="color: var(--primary-magenta);">${emp.nome_equipamento}</td>
                    <td>${emp.nome_colaborador}</td>
                    <td>${dataFormatada}</td>
                    <td><span class="badge ${corBadge} p-2">${emp.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-light rounded-pill px-3" onclick="abrirEdicao(${emp.id})">
                            <i class="bi bi-pencil-square me-1"></i> Atualizar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
    }
}

window.abrirModalNovo = function() {
    document.getElementById('formControle').reset();
    document.getElementById('editId').value = '';
    
    document.getElementById('id_colaborador').disabled = false;
    document.getElementById('id_equipamento').disabled = false;
    document.getElementById('data_saida').disabled = false;
    document.getElementById('data_prevista').disabled = false;
    document.getElementById('condicao_entrega').disabled = false;

    selectStatus.innerHTML = `
        <option value="" disabled selected>Selecione...</option>
        <option value="Emprestado">Emprestado</option>
        <option value="Fornecido">Fornecido</option>
    `;
    divDevolucao.classList.add('d-none');
    
    modalControle.show();
}

window.abrirEdicao = async function(id) {
    try {
        const response = await fetch(`${API_URL}/emprestimos/${id}`);
        const emp = await response.json();

        document.getElementById('editId').value = emp.id;
        document.getElementById('id_colaborador').value = emp.id_colaborador;
        document.getElementById('id_equipamento').value = emp.id_equipamento;
        document.getElementById('data_saida').value = emp.data_saida ? emp.data_saida.split('T')[0] : '';
        document.getElementById('data_prevista').value = emp.data_prevista ? emp.data_prevista.split('T')[0] : '';
        document.getElementById('condicao_entrega').value = emp.condicao_entrega || '';

        document.getElementById('id_colaborador').disabled = true;
        document.getElementById('id_equipamento').disabled = true;
        document.getElementById('data_saida').disabled = true;
        document.getElementById('data_prevista').disabled = true;
        document.getElementById('condicao_entrega').disabled = true;

        selectStatus.innerHTML = `
            <option value="Emprestado">Emprestado</option>
            <option value="Fornecido">Fornecido</option>
            <option value="Devolvido">Devolvido</option>
            <option value="Danificado">Danificado</option>
            <option value="Perdido">Perdido</option>
        `;
        selectStatus.value = emp.status;

        if (['Devolvido', 'Danificado', 'Perdido'].includes(emp.status)) {
            divDevolucao.classList.remove('d-none');
            if(emp.data_devolucao) document.getElementById('data_devolucao').value = emp.data_devolucao.split('T')[0];
            document.getElementById('observacao_devolucao').value = emp.observacao || '';
        } else {
            divDevolucao.classList.add('d-none');
        }

        modalControle.show();
    } catch (error) {
    }
}

formControle.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    let payload = {};
    let url = `${API_URL}/emprestimos`;
    let method = 'POST';

    if (id) {
        url = `${API_URL}/emprestimos/${id}`;
        method = 'PUT';
        payload = {
            status: document.getElementById('status').value,
            data_devolucao: document.getElementById('data_devolucao').value || null,
            observacao_devolucao: document.getElementById('observacao_devolucao').value
        };
    } else {
        const saida = new Date(document.getElementById('data_saida').value);
        const prevista = new Date(document.getElementById('data_prevista').value);
        if(prevista <= saida) {
            alert('A data prevista deve ser POSTERIOR a data atual/saída!');
            return;
        }

        payload = {
            id_colaborador: document.getElementById('id_colaborador').value,
            id_equipamento: document.getElementById('id_equipamento').value,
            data_saida: document.getElementById('data_saida').value,
            data_prevista: document.getElementById('data_prevista').value,
            condicao_entrega: document.getElementById('condicao_entrega').value,
            status: document.getElementById('status').value
        };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(id ? 'Status atualizado com sucesso!' : 'Empréstimo registrado com sucesso!');
            modalControle.hide();
            carregarEmprestimos();
        } else {
            const erroData = await response.json();
            alert('❌ ERRO NO SERVIDOR: ' + erroData.error);
        }
    } catch (error) {
        alert('❌ ERRO DE CONEXÃO: ' + error.message);
    }
});
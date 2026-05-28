const API_URL = 'http://localhost:3000/api';
const formControle = document.getElementById('formControle');
const tabelaEmprestimos = document.getElementById('tabelaEmprestimos');
const inputPesquisaControle = document.getElementById('inputPesquisaControle');
const btnPesquisarControle = document.getElementById('btnPesquisarControle');
const modalControle = new bootstrap.Modal(document.getElementById('modalControle'));
const selectStatus = document.getElementById('status');
const divDevolucao = document.getElementById('divDevolucao');
const dataPrevista = document.getElementById('data_prevista');
const containerDataPrevista = document.getElementById('containerDataPrevista');
const containerQuantidade = document.getElementById('containerQuantidade');

let todosEmprestimos = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarListasFormulario();
    carregarEmprestimos();
    configurarDataMinima();
    configurarPesquisaControle();
    configurarStatusControle();
});

function mostrarToast(mensagem, tipo = 'sucesso') {
    let container = document.getElementById('toastContainerProteq');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainerProteq';
        container.style.position = 'fixed';
        container.style.top = '22px';
        container.style.right = '22px';
        container.style.zIndex = '9999';
        container.style.display = 'grid';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const cores = {
        sucesso: {
            fundo: '#e7f5eb',
            texto: '#2f7546',
            borda: '#bfe4c9',
            icone: 'bi-check-circle-fill'
        },
        erro: {
            fundo: '#fde8e8',
            texto: '#a43838',
            borda: '#f1b9b9',
            icone: 'bi-x-circle-fill'
        },
        aviso: {
            fundo: '#fff2d8',
            texto: '#97651f',
            borda: '#ead39e',
            icone: 'bi-exclamation-circle-fill'
        }
    };

    const estilo = cores[tipo] || cores.sucesso;

    const toast = document.createElement('div');
    toast.style.minWidth = '280px';
    toast.style.maxWidth = '360px';
    toast.style.background = estilo.fundo;
    toast.style.color = estilo.texto;
    toast.style.border = `1px solid ${estilo.borda}`;
    toast.style.borderRadius = '18px';
    toast.style.padding = '14px 16px';
    toast.style.boxShadow = '0 16px 35px rgba(0,0,0,0.18)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.fontWeight = '800';
    toast.style.animation = 'toastEntradaProteq 0.25s ease';

    toast.innerHTML = `
        <i class="bi ${estilo.icone}" style="font-size: 1.1rem;"></i>
        <span>${mensagem}</span>
    `;

    if (!document.getElementById('toastAnimacaoProteq')) {
        const style = document.createElement('style');
        style.id = 'toastAnimacaoProteq';
        style.textContent = `
            @keyframes toastEntradaProteq {
                from {
                    opacity: 0;
                    transform: translateX(18px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(18px)';
        toast.style.transition = '0.25s ease';

        setTimeout(() => {
            toast.remove();
        }, 260);
    }, 3200);
}

function configurarDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];

    if (dataPrevista) {
        dataPrevista.setAttribute('min', hoje);
    }

    const dataSaida = document.getElementById('data_saida');

    if (dataSaida) {
        dataSaida.setAttribute('max', hoje);
    }
}

function configurarPesquisaControle() {
    if (inputPesquisaControle) {
        inputPesquisaControle.addEventListener('input', aplicarPesquisaControle);
    }

    if (btnPesquisarControle) {
        btnPesquisarControle.addEventListener('click', aplicarPesquisaControle);
    }
}

function configurarStatusControle() {
    if (selectStatus) {
        selectStatus.addEventListener('change', atualizarCamposPorStatus);
    }
}

function atualizarCamposPorStatus() {
    const status = selectStatus.value;
    const dataDevolucao = document.getElementById('data_devolucao');
    const observacaoDevolucao = document.getElementById('observacao_devolucao');

    const precisaPrevisao = status === 'Emprestado';
    const statusComDevolucao = ['Devolvido', 'Danificado', 'Perdido'];

    if (precisaPrevisao) {
        containerDataPrevista.classList.remove('d-none');
        dataPrevista.required = true;
    } else {
        containerDataPrevista.classList.add('d-none');
        dataPrevista.required = false;
        dataPrevista.value = '';
    }

    if (statusComDevolucao.includes(status)) {
        divDevolucao.classList.remove('d-none');
        dataDevolucao.required = true;
    } else {
        divDevolucao.classList.add('d-none');
        dataDevolucao.required = false;
        dataDevolucao.value = '';
        observacaoDevolucao.value = '';
    }

    if (status === 'Fornecido') {
        containerQuantidade.className = 'col-md-8';
    } else {
        containerQuantidade.className = 'col-md-4';
    }
}

function normalizarTexto(texto) {
    return String(texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function escaparHTML(valor) {
    return String(valor || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function aplicarPesquisaControle() {
    const termo = normalizarTexto(inputPesquisaControle.value);

    if (!termo) {
        desenharTabelaEmprestimos(todosEmprestimos);
        return;
    }

    const filtrados = todosEmprestimos.filter(emp => {
        const id = normalizarTexto(emp.id);
        const equipamento = normalizarTexto(emp.nome_equipamento);
        const colaborador = normalizarTexto(emp.nome_colaborador);
        const status = normalizarTexto(emp.status);
        const dataSaida = formatarData(emp.data_saida);

        return id.includes(termo) ||
            equipamento.includes(termo) ||
            colaborador.includes(termo) ||
            status.includes(termo) ||
            normalizarTexto(dataSaida).includes(termo);
    });

    desenharTabelaEmprestimos(filtrados);
}

function formatarData(data) {
    if (!data) {
        return '';
    }

    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function classeBadgeControle(status) {
    const valor = normalizarTexto(status);

    if (valor === 'emprestado') {
        return 'status-emprestado';
    }

    if (valor === 'fornecido') {
        return 'status-fornecido';
    }

    if (valor === 'devolvido') {
        return 'status-devolvido';
    }

    if (valor === 'danificado') {
        return 'status-danificado';
    }

    if (valor === 'perdido') {
        return 'status-perdido';
    }

    return 'status-padrao';
}

async function carregarListasFormulario() {
    try {
        const resColab = await fetch(`${API_URL}/colaboradores`);
        const colabs = await resColab.json();
        const selectColab = document.getElementById('id_colaborador');

        selectColab.innerHTML = '<option value="">Selecione um colaborador...</option>';

        colabs
            .filter(c => c.status === 'Ativo')
            .forEach(c => {
                selectColab.innerHTML += `<option value="${escaparHTML(c.id)}">${escaparHTML(c.nome)}</option>`;
            });

        const resEquip = await fetch(`${API_URL}/equipamentos`);
        const equips = await resEquip.json();
        const selectEquip = document.getElementById('id_equipamento');

        selectEquip.innerHTML = '<option value="">Selecione um equipamento...</option>';

        equips
            .filter(e => e.status === 'Disponível')
            .forEach(e => {
                selectEquip.innerHTML += `<option value="${escaparHTML(e.id)}">${escaparHTML(e.nome)} (Estoque: ${escaparHTML(e.quantidade)})</option>`;
            });
    } catch (error) {
        mostrarToast('Erro ao carregar colaboradores e equipamentos.', 'erro');
    }
}

async function carregarEmprestimos() {
    try {
        const response = await fetch(`${API_URL}/emprestimos`);
        todosEmprestimos = await response.json();
        desenharTabelaEmprestimos(todosEmprestimos);
    } catch (error) {
        mostrarToast('Erro ao carregar as movimentações.', 'erro');
    }
}

function desenharTabelaEmprestimos(emprestimos) {
    tabelaEmprestimos.innerHTML = '';

    if (!emprestimos || emprestimos.length === 0) {
        tabelaEmprestimos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">Nenhuma movimentação encontrada.</td>
            </tr>
        `;
        return;
    }

    emprestimos.forEach(emp => {
        const badgeClasse = classeBadgeControle(emp.status);
        const dataFormatada = formatarData(emp.data_saida);

        tabelaEmprestimos.innerHTML += `
            <tr>
                <td>#${escaparHTML(emp.id)}</td>
                <td class="fw-bold" style="color: var(--primary-magenta);">${escaparHTML(emp.nome_equipamento)}</td>
                <td>${escaparHTML(emp.nome_colaborador)}</td>
                <td>${escaparHTML(dataFormatada)}</td>
                <td><span class="status-badge ${badgeClasse}">${escaparHTML(emp.status)}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-light rounded-pill px-3" onclick="abrirEdicao(${emp.id})">
                        <i class="bi bi-pencil-square me-1"></i> Atualizar
                    </button>
                </td>
            </tr>
        `;
    });
}

window.abrirModalNovo = function() {
    formControle.reset();
    document.getElementById('editId').value = '';

    document.getElementById('id_colaborador').disabled = false;
    document.getElementById('id_equipamento').disabled = false;
    document.getElementById('data_saida').disabled = false;
    document.getElementById('data_prevista').disabled = false;
    document.getElementById('condicao_entrega').disabled = false;

    selectStatus.innerHTML = `
        <option value="" disabled selected>Selecione o tipo de movimentação...</option>
        <option value="Emprestado">Emprestado</option>
        <option value="Fornecido">Fornecido</option>
    `;

    divDevolucao.classList.add('d-none');
    containerDataPrevista.classList.add('d-none');
    dataPrevista.required = false;
    dataPrevista.value = '';
    containerQuantidade.className = 'col-md-4';

    modalControle.show();
};

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

        if (emp.data_devolucao) {
            document.getElementById('data_devolucao').value = emp.data_devolucao.split('T')[0];
        } else {
            document.getElementById('data_devolucao').value = '';
        }

        document.getElementById('observacao_devolucao').value = emp.observacao || emp.observacao_devolucao || '';

        atualizarCamposPorStatus();
        modalControle.show();
    } catch (error) {
        mostrarToast('Erro ao buscar os dados desta movimentação.', 'erro');
    }
};

formControle.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const status = document.getElementById('status').value;

    let payload = {};
    let url = `${API_URL}/emprestimos`;
    let method = 'POST';

    if (id) {
        url = `${API_URL}/emprestimos/${id}`;
        method = 'PUT';

        payload = {
            status: status,
            data_devolucao: document.getElementById('data_devolucao').value || null,
            observacao_devolucao: document.getElementById('observacao_devolucao').value
        };
    } else {
        const dataSaidaValor = document.getElementById('data_saida').value;
        const dataPrevistaValor = document.getElementById('data_prevista').value;

        if (status === 'Emprestado') {
            if (!dataPrevistaValor) {
                mostrarToast('Informe a previsão de devolução.', 'aviso');
                return;
            }

            const saida = new Date(dataSaidaValor);
            const prevista = new Date(dataPrevistaValor);

            if (prevista <= saida) {
                mostrarToast('A data prevista deve ser posterior à data de saída.', 'aviso');
                return;
            }
        }

        payload = {
            id_colaborador: document.getElementById('id_colaborador').value,
            id_equipamento: document.getElementById('id_equipamento').value,
            data_saida: dataSaidaValor,
            data_prevista: status === 'Emprestado' ? dataPrevistaValor : null,
            condicao_entrega: document.getElementById('condicao_entrega').value,
            status: status
        };
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            mostrarToast(id ? 'Status atualizado com sucesso.' : 'Movimentação registrada com sucesso.', 'sucesso');
            modalControle.hide();
            await carregarEmprestimos();
            aplicarPesquisaControle();
        } else {
            const erroData = await response.json();
            mostrarToast(erroData.error || erroData.message || 'Erro no servidor.', 'erro');
        }
    } catch (error) {
        mostrarToast('Erro de conexão com o servidor.', 'erro');
    }
});
const API_URL = 'http://localhost:3000/api';
const tabelaRelatorio = document.getElementById('tabelaRelatorio');
const filtroColaborador = document.getElementById('filtroColaborador');
const filtroEquipamento = document.getElementById('filtroEquipamento');
const filtroStatus = document.getElementById('filtroStatus');

const resumoFiltroAtual = document.getElementById('resumoFiltroAtual');
const resumoEmAberto = document.getElementById('resumoEmAberto');
const resumoEmAbertoInfo = document.getElementById('resumoEmAbertoInfo');
const resumoDevolvidos = document.getElementById('resumoDevolvidos');
const resumoDevolvidosInfo = document.getElementById('resumoDevolvidosInfo');
const resumoAtrasados = document.getElementById('resumoAtrasados');
const resumoAtrasadosInfo = document.getElementById('resumoAtrasadosInfo');
const resumoOcorrencias = document.getElementById('resumoOcorrencias');
const resumoOcorrenciasInfo = document.getElementById('resumoOcorrenciasInfo');

const cardsResumoRelatorio = document.querySelectorAll('.resumo-card-relatorio');
const btnExportarRelatorio = document.getElementById('btnExportarRelatorio');
const btnLimparFiltrosRelatorio = document.getElementById('btnLimparFiltrosRelatorio');

let todosEmprestimos = [];
let dadosAtuaisRelatorio = [];
let filtroResumoAtual = 'abertos';

document.addEventListener('DOMContentLoaded', () => {
    configurarFiltros();
    configurarCardsResumo();
    carregarRelatorios();
});

function configurarFiltros() {
    if (filtroColaborador) {
        filtroColaborador.addEventListener('input', aplicarFiltros);
    }

    if (filtroEquipamento) {
        filtroEquipamento.addEventListener('input', aplicarFiltros);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener('change', aplicarFiltros);
    }

    if (btnExportarRelatorio) {
        btnExportarRelatorio.addEventListener('click', exportarRelatorioCSV);
    }

    if (btnLimparFiltrosRelatorio) {
        btnLimparFiltrosRelatorio.addEventListener('click', limparFiltrosRelatorio);
    }
}

function configurarCardsResumo() {
    cardsResumoRelatorio.forEach(card => {
        card.addEventListener('click', () => {
            filtroResumoAtual = card.dataset.filtro || 'abertos';
            aplicarFiltros();

            if (tabelaRelatorio) {
                tabelaRelatorio.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_URL}/emprestimos`);
        todosEmprestimos = await response.json();
        aplicarFiltros();
    } catch (error) {
        tabelaRelatorio.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Erro ao carregar os relatórios.</td></tr>`;
    }
}

function normalizarTexto(texto) {
    return String(texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function criarData(data) {
    if (!data) {
        return null;
    }

    const dataLimpa = String(data).split('T')[0];
    const partes = dataLimpa.split('-');

    if (partes.length !== 3) {
        return null;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    if (!ano || mes < 0 || !dia) {
        return null;
    }

    return new Date(ano, mes, dia);
}

function formatarData(data) {
    const dataCriada = criarData(data);

    if (!dataCriada) {
        return '<span class="text-muted">---</span>';
    }

    return dataCriada.toLocaleDateString('pt-BR');
}

function formatarDataExportacao(data) {
    const dataCriada = criarData(data);

    if (!dataCriada) {
        return '';
    }

    return dataCriada.toLocaleDateString('pt-BR');
}

function escaparHTML(valor) {
    return String(valor || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function statusEmAberto(status) {
    return status === 'Emprestado' || status === 'Fornecido';
}

function estaAtrasado(emp) {
    if (!statusEmAberto(emp.status)) {
        return false;
    }

    const prevista = criarData(emp.data_prevista);

    if (!prevista) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return prevista < hoje;
}

function temOcorrencia(emp) {
    return emp.status === 'Danificado' || emp.status === 'Perdido';
}

function quantidadeDoEmprestimo(emp) {
    const quantidade = Number(emp.condicao_entrega);

    if (Number.isFinite(quantidade) && quantidade > 0) {
        return quantidade;
    }

    return 1;
}

function somarQuantidades(lista) {
    return lista.reduce((total, emp) => total + quantidadeDoEmprestimo(emp), 0);
}

function formatarQuantidade(valor) {
    return Number(valor || 0).toLocaleString('pt-BR');
}

function textoRegistro(total) {
    return total === 1 ? '1 registro' : `${total} registros`;
}

function aplicarEstiloCardAtivo() {
    cardsResumoRelatorio.forEach(card => {
        const ativo = card.dataset.filtro === filtroResumoAtual;

        if (ativo) {
            card.style.borderColor = 'var(--rosa-borda, #e4b3c2)';
            card.style.boxShadow = '0 14px 30px rgba(184, 79, 114, 0.16)';
            card.style.transform = 'translateY(-2px)';
        } else {
            card.style.borderColor = 'var(--border-soft, #ebe4dc)';
            card.style.boxShadow = 'none';
            card.style.transform = 'translateY(0)';
        }
    });
}

function atualizarTituloFiltro(total) {
    if (!resumoFiltroAtual) {
        return;
    }

    const nomes = {
        abertos: 'Em aberto',
        devolvidos: 'Devolvidos',
        atrasados: 'Atrasados',
        ocorrencias: 'Ocorrências'
    };

    const label = nomes[filtroResumoAtual] || 'Em aberto';
    resumoFiltroAtual.textContent = `Filtro atual: ${label} • ${textoRegistro(total)}`;
}

function atualizarResumoBase(dados) {
    const emAberto = dados.filter(emp => statusEmAberto(emp.status));
    const devolvidos = dados.filter(emp => emp.status === 'Devolvido');
    const atrasados = dados.filter(emp => estaAtrasado(emp));
    const ocorrencias = dados.filter(emp => temOcorrencia(emp));

    resumoEmAberto.textContent = formatarQuantidade(somarQuantidades(emAberto));
    resumoEmAbertoInfo.textContent = textoRegistro(emAberto.length);
    resumoDevolvidos.textContent = formatarQuantidade(somarQuantidades(devolvidos));
    resumoDevolvidosInfo.textContent = textoRegistro(devolvidos.length);
    resumoAtrasados.textContent = formatarQuantidade(somarQuantidades(atrasados));
    resumoAtrasadosInfo.textContent = textoRegistro(atrasados.length);
    resumoOcorrencias.textContent = formatarQuantidade(somarQuantidades(ocorrencias));
    resumoOcorrenciasInfo.textContent = textoRegistro(ocorrencias.length);
}

function aplicarFiltroResumo(lista) {
    if (filtroResumoAtual === 'abertos') {
        return lista.filter(emp => statusEmAberto(emp.status));
    }

    if (filtroResumoAtual === 'devolvidos') {
        return lista.filter(emp => emp.status === 'Devolvido');
    }

    if (filtroResumoAtual === 'atrasados') {
        return lista.filter(emp => estaAtrasado(emp));
    }

    if (filtroResumoAtual === 'ocorrencias') {
        return lista.filter(emp => temOcorrencia(emp));
    }

    return lista;
}

function aplicarFiltros() {
    const valorColab = normalizarTexto(filtroColaborador ? filtroColaborador.value : '');
    const valorEquip = normalizarTexto(filtroEquipamento ? filtroEquipamento.value : '');
    const valorStatus = filtroStatus ? filtroStatus.value : '';

    let dadosFiltrados = todosEmprestimos.filter(emp => {
        const colaborador = normalizarTexto(emp.nome_colaborador);
        const equipamento = normalizarTexto(emp.nome_equipamento);
        const status = emp.status || '';

        const bateColab = colaborador.includes(valorColab);
        const bateEquip = equipamento.includes(valorEquip);
        const bateStatus = valorStatus === '' || status === valorStatus;

        return bateColab && bateEquip && bateStatus;
    });

    atualizarResumoBase(dadosFiltrados);
    dadosFiltrados = aplicarFiltroResumo(dadosFiltrados);
    desenharTabela(dadosFiltrados);
}

function limparFiltrosRelatorio() {
    filtroResumoAtual = 'abertos';

    if (filtroColaborador) {
        filtroColaborador.value = '';
    }

    if (filtroEquipamento) {
        filtroEquipamento.value = '';
    }

    if (filtroStatus) {
        filtroStatus.value = '';
    }

    aplicarFiltros();

    if (tabelaRelatorio) {
        tabelaRelatorio.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function classeBadge(status) {
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

function desenharTabela(dados) {
    tabelaRelatorio.innerHTML = '';
    dadosAtuaisRelatorio = dados;
    atualizarTituloFiltro(dados.length);
    aplicarEstiloCardAtivo();

    if (dados.length === 0) {
        tabelaRelatorio.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    dados.forEach(emp => {
        const dataSaida = formatarData(emp.data_saida);
        const dataPrevista = formatarData(emp.data_prevista);
        const dataDev = formatarData(emp.data_devolucao);
        const badge = classeBadge(emp.status);
        const atrasado = estaAtrasado(emp);
        const estiloPrevista = atrasado ? 'color: #a43838; font-weight: 900;' : '';

        tabelaRelatorio.innerHTML += `
            <tr>
                <td class="text-muted">#${escaparHTML(emp.id)}</td>
                <td class="fw-bold">${escaparHTML(emp.nome_colaborador || '---')}</td>
                <td style="color: var(--primary-magenta); font-weight: 800;">${escaparHTML(emp.nome_equipamento || '---')}</td>
                <td>${dataSaida}</td>
                <td style="${estiloPrevista}">${dataPrevista}</td>
                <td>${dataDev}</td>
                <td>
                    <span class="status-badge ${badge}">${escaparHTML(emp.status || '---')}</span>
                    ${atrasado ? '<span class="status-badge status-atrasado ms-1">Atrasado</span>' : ''}
                </td>
            </tr>
        `;
    });
}

function valorCSV(valor) {
    const texto = String(valor ?? '').replace(/"/g, '""');
    return `"${texto}"`;
}

function nomeArquivoRelatorio() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');

    return `relatorio-emprestimos-${ano}-${mes}-${dia}-${hora}${minuto}.csv`;
}

function exportarRelatorioCSV() {
    if (!dadosAtuaisRelatorio || dadosAtuaisRelatorio.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }

    const cabecalho = [
        'ID',
        'Colaborador',
        'Equipamento',
        'Data saída',
        'Data prevista',
        'Data devolução',
        'Status',
        'Atrasado'
    ];

    const linhas = dadosAtuaisRelatorio.map(emp => [
        emp.id || '',
        emp.nome_colaborador || '',
        emp.nome_equipamento || '',
        formatarDataExportacao(emp.data_saida),
        formatarDataExportacao(emp.data_prevista),
        formatarDataExportacao(emp.data_devolucao),
        emp.status || '',
        estaAtrasado(emp) ? 'Sim' : 'Não'
    ]);

    const conteudo = [
        cabecalho.map(valorCSV).join(';'),
        ...linhas.map(linha => linha.map(valorCSV).join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + conteudo], {
        type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = nomeArquivoRelatorio();
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}
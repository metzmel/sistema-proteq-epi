const API_URL = 'http://localhost:3000/api';
const tabelaRelatorio = document.getElementById('tabelaRelatorio');
const filtroColaborador = document.getElementById('filtroColaborador');
const filtroEquipamento = document.getElementById('filtroEquipamento');
const filtroStatus = document.getElementById('filtroStatus');
let todosEmprestimos = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarRelatorios();
});

async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_URL}/emprestimos`);
        todosEmprestimos = await response.json();
        desenharTabela(todosEmprestimos);
    } catch (error) {
        console.error(error);
    }
}

function aplicarFiltros() {
    const valorColab = filtroColaborador.value.toLowerCase();
    const valorEquip = filtroEquipamento.value.toLowerCase();
    const valorStatus = filtroStatus.value;

    const dadosFiltrados = todosEmprestimos.filter(emp => {
        const bateColab = emp.nome_colaborador.toLowerCase().includes(valorColab);
        const bateEquip = emp.nome_equipamento.toLowerCase().includes(valorEquip);
        const bateStatus = (valorStatus === "") || (emp.status === valorStatus);
        return bateColab && bateEquip && bateStatus;
    });

    desenharTabela(dadosFiltrados);
}

filtroColaborador.addEventListener('keyup', aplicarFiltros);
filtroEquipamento.addEventListener('keyup', aplicarFiltros);
filtroStatus.addEventListener('change', aplicarFiltros);

function desenharTabela(dados) {
    tabelaRelatorio.innerHTML = '';

    if (dados.length === 0) {
        tabelaRelatorio.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    dados.forEach(emp => {
        let corBadge = 'bg-primary';
        if(emp.status === 'Devolvido') corBadge = 'bg-success';
        if(emp.status === 'Danificado' || emp.status === 'Perdido') corBadge = 'bg-danger';
        if(emp.status === 'Fornecido') corBadge = 'bg-info';

        const dataSaida = new Date(emp.data_saida).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        const dataDev = emp.data_devolucao ? new Date(emp.data_devolucao).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '<span class="text-muted">---</span>';

        tabelaRelatorio.innerHTML += `
            <tr>
                <td class="text-muted">#${emp.id}</td>
                <td class="fw-bold">${emp.nome_colaborador}</td>
                <td style="color: var(--primary-magenta);">${emp.nome_equipamento}</td>
                <td>${dataSaida}</td>
                <td>${dataDev}</td>
                <td><span class="badge ${corBadge} p-2">${emp.status}</span></td>
            </tr>
        `;
    });
}
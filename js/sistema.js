const API_URL = 'http://localhost:3000/api';

const sistemaStatusGeral = document.getElementById('sistemaStatusGeral');
const cardServidorValor = document.getElementById('cardServidorValor');
const cardServidorInfo = document.getElementById('cardServidorInfo');
const cardBancoValor = document.getElementById('cardBancoValor');
const cardBancoInfo = document.getElementById('cardBancoInfo');
const cardAmbienteValor = document.getElementById('cardAmbienteValor');
const cardAmbienteInfo = document.getElementById('cardAmbienteInfo');
const cardSessaoValor = document.getElementById('cardSessaoValor');
const cardSessaoInfo = document.getElementById('cardSessaoInfo');
const moduloColaboradores = document.getElementById('moduloColaboradores');
const moduloEquipamentos = document.getElementById('moduloEquipamentos');
const moduloEmprestimos = document.getElementById('moduloEmprestimos');
const leituraInteligente = document.getElementById('leituraInteligente');
const diagApiInfo = document.getElementById('diagApiInfo');
const diagApiBadge = document.getElementById('diagApiBadge');
const diagBancoInfo = document.getElementById('diagBancoInfo');
const diagBancoBadge = document.getElementById('diagBancoBadge');
const diagSessaoInfo = document.getElementById('diagSessaoInfo');
const diagSessaoBadge = document.getElementById('diagSessaoBadge');
const origemPagina = document.getElementById('origemPagina');
const btnAtualizarSistema = document.getElementById('btnAtualizarSistema');
const btnTestarConexao = document.getElementById('btnTestarConexao');
const btnExportarDiagnostico = document.getElementById('btnExportarDiagnostico');

let diagnosticoAtual = {
    servidor: false,
    banco: false,
    sessao: false,
    colaboradores: 0,
    equipamentos: 0,
    emprestimos: 0,
    data: ''
};

document.addEventListener('DOMContentLoaded', () => {
    configurarAmbiente();
    configurarBotoes();
    carregarPainelSistema();
});

function configurarAmbiente() {
    origemPagina.textContent = window.location.href;

    if (window.location.protocol === 'file:') {
        cardAmbienteValor.textContent = 'Local';
        cardAmbienteInfo.textContent = 'Arquivo aberto no navegador';
    } else {
        cardAmbienteValor.textContent = 'Web';
        cardAmbienteInfo.textContent = window.location.origin;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuario) {
        cardSessaoValor.textContent = 'Ativa';
        cardSessaoInfo.textContent = usuario.nome || 'Usuário conectado';
        diagSessaoInfo.textContent = 'Usuário autenticado no navegador';
        definirBadge(diagSessaoBadge, 'OK', 'bg-success');
        diagnosticoAtual.sessao = true;
    } else {
        cardSessaoValor.textContent = 'Ausente';
        cardSessaoInfo.textContent = 'Nenhum usuário conectado';
        diagSessaoInfo.textContent = 'Sessão não encontrada';
        definirBadge(diagSessaoBadge, 'Atenção', 'bg-danger');
        diagnosticoAtual.sessao = false;
    }
}

function configurarBotoes() {
    if (btnAtualizarSistema) {
        btnAtualizarSistema.addEventListener('click', carregarPainelSistema);
    }

    if (btnTestarConexao) {
        btnTestarConexao.addEventListener('click', carregarPainelSistema);
    }

    if (btnExportarDiagnostico) {
        btnExportarDiagnostico.addEventListener('click', exportarDiagnostico);
    }
}

async function carregarPainelSistema() {
    definirStatusCarregando();

    try {
        const [colaboradores, equipamentos, emprestimos] = await Promise.all([
            buscarDados('/colaboradores'),
            buscarDados('/equipamentos'),
            buscarDados('/emprestimos')
        ]);

        diagnosticoAtual.servidor = true;
        diagnosticoAtual.banco = true;
        diagnosticoAtual.colaboradores = colaboradores.length;
        diagnosticoAtual.equipamentos = equipamentos.length;
        diagnosticoAtual.emprestimos = emprestimos.length;
        diagnosticoAtual.data = new Date().toLocaleString('pt-BR');

        moduloColaboradores.textContent = colaboradores.length;
        moduloEquipamentos.textContent = equipamentos.length;
        moduloEmprestimos.textContent = emprestimos.length;

        cardServidorValor.textContent = 'Online';
        cardServidorInfo.textContent = 'API respondendo na porta 3000';
        cardBancoValor.textContent = 'Conectado';
        cardBancoInfo.textContent = 'Dados recebidos com sucesso';

        definirBadge(diagApiBadge, 'OK', 'bg-success');
        diagApiInfo.textContent = 'Servidor respondeu corretamente';
        definirBadge(diagBancoBadge, 'OK', 'bg-success');
        diagBancoInfo.textContent = 'Consultas retornaram dados';

        sistemaStatusGeral.innerHTML = '<i class="bi bi-circle-fill" style="font-size: 0.55rem;"></i> Sistema operacional';
        sistemaStatusGeral.style.background = '#e7f5eb';
        sistemaStatusGeral.style.color = '#2f7546';
        sistemaStatusGeral.style.borderColor = '#bfe4c9';

        atualizarLeituraInteligente(colaboradores, equipamentos, emprestimos);
    } catch (error) {
        diagnosticoAtual.servidor = false;
        diagnosticoAtual.banco = false;
        diagnosticoAtual.data = new Date().toLocaleString('pt-BR');

        cardServidorValor.textContent = 'Offline';
        cardServidorInfo.textContent = 'Não foi possível acessar a API';
        cardBancoValor.textContent = 'Indisponível';
        cardBancoInfo.textContent = 'Depende da conexão com o servidor';

        moduloColaboradores.textContent = '0';
        moduloEquipamentos.textContent = '0';
        moduloEmprestimos.textContent = '0';

        definirBadge(diagApiBadge, 'Falha', 'bg-danger');
        diagApiInfo.textContent = 'Verifique se o Node.js está rodando';
        definirBadge(diagBancoBadge, 'Falha', 'bg-danger');
        diagBancoInfo.textContent = 'Sem resposta das rotas da API';

        sistemaStatusGeral.innerHTML = '<i class="bi bi-circle-fill" style="font-size: 0.55rem;"></i> Sistema com atenção';
        sistemaStatusGeral.style.background = '#fde8e8';
        sistemaStatusGeral.style.color = '#a43838';
        sistemaStatusGeral.style.borderColor = '#f1b9b9';

        leituraInteligente.textContent = 'Não foi possível analisar os dados. Confirme se o servidor Node.js está aberto com node server.js e se o MySQL está ativo no XAMPP.';
    }
}

function definirStatusCarregando() {
    cardServidorValor.textContent = 'Testando';
    cardServidorInfo.textContent = 'Consultando API';
    cardBancoValor.textContent = 'Testando';
    cardBancoInfo.textContent = 'Consultando dados';
    definirBadge(diagApiBadge, 'Teste', 'bg-primary');
    definirBadge(diagBancoBadge, 'Teste', 'bg-primary');
    diagApiInfo.textContent = 'Verificando porta 3000';
    diagBancoInfo.textContent = 'Aguardando resposta da API';
    sistemaStatusGeral.innerHTML = '<i class="bi bi-circle-fill" style="font-size: 0.55rem;"></i> Verificando sistema';
    sistemaStatusGeral.style.background = 'var(--rosa-suave, #fff4f8)';
    sistemaStatusGeral.style.color = 'var(--rosa-escuro, #6f2b42)';
    sistemaStatusGeral.style.borderColor = 'var(--rosa-borda, #e4b3c2)';
}

async function buscarDados(rota) {
    const response = await fetch(`${API_URL}${rota}`);

    if (!response.ok) {
        throw new Error('Erro na rota ' + rota);
    }

    return await response.json();
}

function definirBadge(elemento, texto, classe) {
    elemento.className = `badge ${classe} p-2`;
    elemento.textContent = texto;
}

function atualizarLeituraInteligente(colaboradores, equipamentos, emprestimos) {
    const ativos = colaboradores.filter(item => item.status === 'Ativo').length;
    const disponiveis = equipamentos.filter(item => item.status === 'Disponível').length;
    const emAberto = emprestimos.filter(item => item.status === 'Emprestado' || item.status === 'Fornecido').length;
    const ocorrencias = emprestimos.filter(item => item.status === 'Danificado' || item.status === 'Perdido').length;

    if (colaboradores.length === 0 && equipamentos.length === 0 && emprestimos.length === 0) {
        leituraInteligente.textContent = 'O sistema está conectado, mas ainda não possui dados cadastrados. O próximo passo é cadastrar colaboradores e equipamentos para iniciar as movimentações.';
        return;
    }

    if (ocorrencias > 0) {
        leituraInteligente.textContent = `O sistema está funcionando e encontrou ${ocorrencias} ocorrência(s) em movimentações. Vale conferir os registros marcados como danificado ou perdido no relatório.`;
        return;
    }

    if (emAberto > 0) {
        leituraInteligente.textContent = `O sistema está saudável. Existem ${emAberto} movimentação(ões) em aberto, ${ativos} colaborador(es) ativo(s) e ${disponiveis} equipamento(s) disponível(is).`;
        return;
    }

    leituraInteligente.textContent = `O sistema está saudável. Existem ${ativos} colaborador(es) ativo(s), ${disponiveis} equipamento(s) disponível(is) e nenhuma movimentação em aberto no momento.`;
}

function exportarDiagnostico() {
    const conteudo = {
        sistema: 'Proteq EPI',
        versaoVisual: '1.0 Rosa Profissional',
        ambiente: cardAmbienteValor.textContent,
        origem: window.location.href,
        diagnostico: diagnosticoAtual
    };

    const blob = new Blob([JSON.stringify(conteudo, null, 2)], {
        type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'diagnostico-proteq-epi.json';
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}
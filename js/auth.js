document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const paginaAtual = window.location.pathname.split('/').pop();

    const styleAvatar = document.createElement('style');
    styleAvatar.textContent = `
        .top-header .user-profile::after {
            content: var(--avatar-iniciais, "US") !important;
        }

        .painel-topbar-proteq {
            position: fixed;
            top: 82px;
            right: 28px;
            width: 390px;
            max-width: calc(100vw - 32px);
            background: var(--bg-glass);
            backdrop-filter: blur(25px);
            border: 1px solid var(--glass-border);
            border-radius: 22px;
            box-shadow: 0 22px 55px rgba(0,0,0,0.35);
            z-index: 9998;
            display: none;
            overflow: hidden;
        }

        .painel-topbar-proteq.aberto {
            display: block;
            animation: painelEntradaProteq 0.22s ease;
        }

        @keyframes painelEntradaProteq {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .painel-topbar-header {
            padding: 18px 20px;
            border-bottom: 1px solid var(--border-soft, #ebe4dc);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .painel-topbar-header h6 {
            margin: 0;
            font-weight: 900;
            color: var(--text-light);
            letter-spacing: -0.02em;
        }

        .painel-topbar-header span {
            display: block;
            color: var(--text-muted);
            font-size: 0.76rem;
            font-weight: 700;
            margin-top: 2px;
        }

        .painel-topbar-body {
            padding: 14px;
            display: grid;
            gap: 10px;
            max-height: 430px;
            overflow-y: auto;
        }

        .painel-topbar-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            background: var(--bg-card-soft, #f8f3ee);
            border: 1px solid var(--border-soft, #ebe4dc);
            border-radius: 16px;
            padding: 13px;
        }

        .painel-topbar-icon {
            width: 38px;
            height: 38px;
            border-radius: 13px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
        }

        .painel-topbar-item strong {
            display: block;
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.25;
        }

        .painel-topbar-item small {
            display: block;
            color: var(--text-muted);
            font-weight: 600;
            margin-top: 3px;
            line-height: 1.35;
        }

        .painel-topbar-footer {
            padding: 14px;
            border-top: 1px solid var(--border-soft, #ebe4dc);
        }

        .painel-topbar-vazio {
            padding: 18px;
            text-align: center;
            color: var(--text-muted);
            font-weight: 700;
        }

        .mensagem-form-proteq {
            background: var(--bg-card-soft, #f8f3ee);
            border: 1px solid var(--border-soft, #ebe4dc);
            border-radius: 18px;
            padding: 14px;
            display: grid;
            gap: 10px;
        }

        .mensagem-form-proteq textarea {
            min-height: 78px;
            resize: none;
        }

        .mensagem-tag {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 4px 9px;
            font-size: 0.68rem;
            font-weight: 900;
            margin-top: 6px;
            border: 1px solid transparent;
        }

        .mensagem-recebida {
            background: var(--rosa-suave, #fff4f8);
            color: var(--rosa-escuro, #6f2b42);
            border-color: var(--rosa-borda, #e4b3c2);
        }

        .mensagem-enviada {
            background: #e7f5eb;
            color: #2f7546;
            border-color: #bfe4c9;
        }
    `;
    document.head.appendChild(styleAvatar);

    function gerarIniciais(nome) {
        if (!nome || typeof nome !== 'string') {
            return 'US';
        }

        const partes = nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (partes.length === 0) {
            return 'US';
        }

        if (partes.length === 1) {
            return partes[0].substring(0, 2).toUpperCase();
        }

        return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
    }

    function aplicarUsuarioNaTela(usuarioLogado) {
        const nome = usuarioLogado.nome || 'Usuário';
        const cargo = usuarioLogado.cargo || 'Usuário';
        const iniciais = gerarIniciais(nome);

        document.querySelectorAll('.user-name').forEach(el => {
            el.textContent = nome;
        });

        document.querySelectorAll('.user-role').forEach(el => {
            el.textContent = cargo;
        });

        document.querySelectorAll('.top-header .user-profile').forEach(perfil => {
            perfil.style.setProperty('--avatar-iniciais', `"${iniciais}"`);
        });

        document.querySelectorAll('.avatar-circle, #perfilAvatar, [data-user-initials]').forEach(avatar => {
            avatar.textContent = iniciais;
        });

        document.querySelectorAll('.user-profile img').forEach(img => {
            img.alt = nome;
        });
    }

    function sairDoSistema(e) {
        if (e) {
            e.preventDefault();
        }

        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    }

    if (!usuario && paginaAtual !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    if (usuario && paginaAtual === 'login.html') {
        window.location.href = 'index.html';
        return;
    }

    if (usuario) {
        aplicarUsuarioNaTela(usuario);
    }

    const botoesSair = [
        document.getElementById('lnkSair'),
        document.getElementById('btnEncerrarSessao'),
        document.getElementById('btnSairPerfil'),
        document.querySelector('.sidebar-footer a')
    ].filter(Boolean);

    botoesSair.forEach(botao => {
        botao.addEventListener('click', sairDoSistema);
    });

    configurarPaineisTopbar(usuario);
});

function configurarPaineisTopbar(usuario) {
    const botaoNotificacao = localizarBotaoPorIcone('bi-bell');
    const botaoMensagem = localizarBotaoPorIcone('bi-chat-dots');

    if (botaoNotificacao) {
        botaoNotificacao.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            abrirPainelNotificacoes(botaoNotificacao);
        });
    }

    if (botaoMensagem) {
        botaoMensagem.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            abrirPainelMensagens(botaoMensagem, usuario);
        });
    }

    document.addEventListener('click', e => {
        const painel = document.querySelector('.painel-topbar-proteq');

        if (painel && !painel.contains(e.target)) {
            painel.remove();
        }
    });

    atualizarBadgesTopbar(usuario);
}

function localizarBotaoPorIcone(classeIcone) {
    const icone = document.querySelector(`.top-header .${classeIcone}`);

    if (!icone) {
        return null;
    }

    return icone.closest('button');
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

function formatarDataPainel(data) {
    const dataCriada = criarData(data);

    if (dataCriada) {
        return dataCriada.toLocaleDateString('pt-BR');
    }

    const outraData = new Date(data);

    if (!Number.isNaN(outraData.getTime())) {
        return outraData.toLocaleString('pt-BR');
    }

    return 'Sem data';
}

function statusEmAberto(status) {
    return status === 'Emprestado' || status === 'Fornecido';
}

function estaAtrasado(emprestimo) {
    if (!statusEmAberto(emprestimo.status)) {
        return false;
    }

    const prevista = criarData(emprestimo.data_prevista);

    if (!prevista) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return prevista < hoje;
}

function escaparPainel(valor) {
    return String(valor || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function removerPainelAberto() {
    const painelAntigo = document.querySelector('.painel-topbar-proteq');

    if (painelAntigo) {
        painelAntigo.remove();
    }
}

function criarPainel(titulo, subtitulo, conteudo, linkTexto, linkHref) {
    removerPainelAberto();

    const painel = document.createElement('div');
    painel.className = 'painel-topbar-proteq aberto';

    painel.innerHTML = `
        <div class="painel-topbar-header">
            <div>
                <h6>${titulo}</h6>
                <span>${subtitulo}</span>
            </div>
            <button type="button" class="icon-btn" id="btnFecharPainelTopbar" style="width: 34px; height: 34px;">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <div class="painel-topbar-body">
            ${conteudo}
        </div>

        <div class="painel-topbar-footer">
            <a href="${linkHref}" class="btn btn-custom btn-sm w-100" style="border-radius: 999px;">
                ${linkTexto}
            </a>
        </div>
    `;

    document.body.appendChild(painel);

    const btnFechar = document.getElementById('btnFecharPainelTopbar');

    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            painel.remove();
        });
    }

    return painel;
}

function itemPainel(icone, titulo, texto, cor = 'rosa') {
    const estilos = {
        rosa: {
            fundo: 'var(--rosa-suave, #fff4f8)',
            cor: 'var(--primary-magenta)'
        },
        verde: {
            fundo: '#e7f5eb',
            cor: '#2f7546'
        },
        amarelo: {
            fundo: '#fff2d8',
            cor: '#97651f'
        },
        vermelho: {
            fundo: '#fde8e8',
            cor: '#a43838'
        }
    };

    const estilo = estilos[cor] || estilos.rosa;

    return `
        <div class="painel-topbar-item">
            <div class="painel-topbar-icon" style="background: ${estilo.fundo}; color: ${estilo.cor};">
                <i class="bi ${icone}"></i>
            </div>
            <div>
                <strong>${titulo}</strong>
                <small>${texto}</small>
            </div>
        </div>
    `;
}

async function buscarDadosTopbar() {
    const [emprestimosResp, equipamentosResp] = await Promise.all([
        fetch('http://localhost:3000/api/emprestimos'),
        fetch('http://localhost:3000/api/equipamentos')
    ]);

    const emprestimos = emprestimosResp.ok ? await emprestimosResp.json() : [];
    const equipamentos = equipamentosResp.ok ? await equipamentosResp.json() : [];

    return { emprestimos, equipamentos };
}

async function atualizarBadgesTopbar(usuario) {
    const botaoNotificacao = localizarBotaoPorIcone('bi-bell');
    const botaoMensagem = localizarBotaoPorIcone('bi-chat-dots');

    try {
        const { emprestimos, equipamentos } = await buscarDadosTopbar();

        const atrasados = emprestimos.filter(item => estaAtrasado(item)).length;
        const estoqueBaixo = equipamentos.filter(item => Number(item.quantidade) <= 2 && item.status === 'Disponível').length;
        const ocorrencias = emprestimos.filter(item => item.status === 'Danificado' || item.status === 'Perdido').length;
        const totalNotificacoes = atrasados + estoqueBaixo + ocorrencias;

        atualizarBadgeBotao(botaoNotificacao, totalNotificacoes);
    } catch (error) {
        atualizarBadgeBotao(botaoNotificacao, 0);
    }

    try {
        if (!usuario || !usuario.id) {
            atualizarBadgeBotao(botaoMensagem, 0);
            return;
        }

        const response = await fetch(`http://localhost:3000/api/mensagens/nao-lidas/${usuario.id}`);
        const dados = response.ok ? await response.json() : { total: 0 };

        atualizarBadgeBotao(botaoMensagem, dados.total || 0);
    } catch (error) {
        atualizarBadgeBotao(botaoMensagem, 0);
    }
}

async function abrirPainelNotificacoes(botao) {
    criarPainel(
        'Notificações',
        'Carregando informações',
        `<div class="painel-topbar-vazio">Verificando o sistema...</div>`,
        'Abrir relatórios',
        'relatorio_emprestimos.html'
    );

    try {
        const { emprestimos, equipamentos } = await buscarDadosTopbar();

        const atrasados = emprestimos.filter(item => estaAtrasado(item));
        const emAberto = emprestimos.filter(item => statusEmAberto(item.status));
        const estoqueBaixo = equipamentos.filter(item => Number(item.quantidade) <= 2 && item.status === 'Disponível');
        const ocorrencias = emprestimos.filter(item => item.status === 'Danificado' || item.status === 'Perdido');

        const itens = [];

        if (atrasados.length > 0) {
            itens.push(itemPainel(
                'bi-clock-history',
                `${atrasados.length} empréstimo(s) atrasado(s)`,
                'Confira os registros com data prevista vencida.',
                'vermelho'
            ));
        }

        if (estoqueBaixo.length > 0) {
            itens.push(itemPainel(
                'bi-box-seam',
                `${estoqueBaixo.length} equipamento(s) com estoque baixo`,
                'Itens disponíveis com quantidade igual ou menor que 2.',
                'amarelo'
            ));
        }

        if (emAberto.length > 0) {
            itens.push(itemPainel(
                'bi-arrow-left-right',
                `${emAberto.length} movimentação(ões) em aberto`,
                'Empréstimos ou fornecimentos ainda não finalizados.',
                'rosa'
            ));
        }

        if (ocorrencias.length > 0) {
            itens.push(itemPainel(
                'bi-exclamation-triangle',
                `${ocorrencias.length} ocorrência(s) registrada(s)`,
                'Há itens marcados como danificado ou perdido.',
                'vermelho'
            ));
        }

        if (itens.length === 0) {
            itens.push(itemPainel(
                'bi-check2-circle',
                'Nenhuma pendência encontrada',
                'Não há atrasos, ocorrências ou estoque baixo no momento.',
                'verde'
            ));
        }

        criarPainel(
            'Notificações',
            `${itens.length} aviso(s) do sistema`,
            itens.join(''),
            'Abrir relatórios',
            'relatorio_emprestimos.html'
        );

        const totalBadge = atrasados.length + estoqueBaixo.length + ocorrencias.length;
        atualizarBadgeBotao(botao, totalBadge);
    } catch (error) {
        criarPainel(
            'Notificações',
            'Sem conexão',
            itemPainel(
                'bi-wifi-off',
                'Não foi possível carregar os avisos',
                'Verifique se o servidor Node.js está rodando.',
                'vermelho'
            ),
            'Ver sistema',
            'sistema.html'
        );
    }
}

function renderizarFormularioMensagem(usuarios, usuarioLogado) {
    const opcoes = usuarios
        .filter(usuario => Number(usuario.id) !== Number(usuarioLogado.id))
        .map(usuario => `<option value="${usuario.id}">${escaparPainel(usuario.nome)} • ${escaparPainel(usuario.cargo || 'Usuário')}</option>`)
        .join('');

    return `
        <form class="mensagem-form-proteq" id="formMensagemTopbar">
            <select class="form-select" id="destinatarioMensagemTopbar" required>
                <option value="">Selecionar destinatário</option>
                ${opcoes}
            </select>

            <textarea class="form-control" id="textoMensagemTopbar" placeholder="Digite uma mensagem..." maxlength="500" required></textarea>

            <button type="submit" class="btn btn-custom btn-sm" style="border-radius: 999px;">
                <i class="bi bi-send me-1"></i> Enviar mensagem
            </button>
        </form>
    `;
}

function renderizarListaMensagens(mensagens, usuarioLogado) {
    if (!mensagens || mensagens.length === 0) {
        return `
            <div class="painel-topbar-vazio">
                Nenhuma mensagem ainda.
            </div>
        `;
    }

    return mensagens.map(item => {
        const recebida = Number(item.id_destinatario) === Number(usuarioLogado.id);
        const nome = recebida ? item.nome_remetente : item.nome_destinatario;
        const cargo = recebida ? item.cargo_remetente : item.cargo_destinatario;
        const tag = recebida ? 'Recebida' : 'Enviada';
        const classeTag = recebida ? 'mensagem-recebida' : 'mensagem-enviada';
        const icone = recebida ? 'bi-envelope' : 'bi-send';
        const textoLida = recebida && Number(item.lida) === 0 ? ' • Nova' : '';

        return `
            <div class="painel-topbar-item">
                <div class="painel-topbar-icon" style="background: var(--rosa-suave, #fff4f8); color: var(--primary-magenta);">
                    <i class="bi ${icone}"></i>
                </div>
                <div>
                    <strong>${escaparPainel(nome)}${textoLida}</strong>
                    <small>${escaparPainel(cargo || 'Usuário')} • ${formatarDataPainel(item.data_envio)}</small>
                    <small>${escaparPainel(item.mensagem)}</small>
                    <span class="mensagem-tag ${classeTag}">${tag}</span>
                </div>
            </div>
        `;
    }).join('');
}

async function marcarMensagensComoLidas(mensagens, usuarioLogado) {
    const naoLidas = mensagens.filter(item => {
        return Number(item.id_destinatario) === Number(usuarioLogado.id) && Number(item.lida) === 0;
    });

    await Promise.all(
        naoLidas.map(item => fetch(`http://localhost:3000/api/mensagens/${item.id}/ler`, {
            method: 'PUT'
        }))
    );
}

async function abrirPainelMensagens(botao, usuarioLogado) {
    if (!usuarioLogado || !usuarioLogado.id) {
        criarPainel(
            'Mensagens',
            'Usuário não identificado',
            itemPainel(
                'bi-person-x',
                'Sessão sem usuário',
                'Saia e entre novamente no sistema.',
                'vermelho'
            ),
            'Voltar ao login',
            'login.html'
        );
        return;
    }

    criarPainel(
        'Mensagens',
        'Carregando conversa',
        `<div class="painel-topbar-vazio">Buscando mensagens...</div>`,
        'Abrir controle',
        'controle_epi.html'
    );

    try {
        const [usuariosResp, mensagensResp] = await Promise.all([
            fetch('http://localhost:3000/api/usuarios'),
            fetch(`http://localhost:3000/api/mensagens/${usuarioLogado.id}`)
        ]);

        const usuarios = usuariosResp.ok ? await usuariosResp.json() : [];
        const mensagens = mensagensResp.ok ? await mensagensResp.json() : [];

        await marcarMensagensComoLidas(mensagens, usuarioLogado);

        const formulario = renderizarFormularioMensagem(usuarios, usuarioLogado);
        const lista = renderizarListaMensagens(mensagens, usuarioLogado);

        criarPainel(
            'Mensagens',
            `${mensagens.length} registro(s)`,
            `${formulario}${lista}`,
            'Atualizar mensagens',
            '#'
        );

        configurarEnvioMensagem(usuarioLogado);
        atualizarBadgeBotao(botao, 0);
    } catch (error) {
        criarPainel(
            'Mensagens',
            'Sem conexão',
            itemPainel(
                'bi-wifi-off',
                'Não foi possível carregar as mensagens',
                'Verifique se o servidor Node.js está rodando.',
                'vermelho'
            ),
            'Ver sistema',
            'sistema.html'
        );
    }
}

function configurarEnvioMensagem(usuarioLogado) {
    const form = document.getElementById('formMensagemTopbar');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const select = document.getElementById('destinatarioMensagemTopbar');
        const textarea = document.getElementById('textoMensagemTopbar');

        const idDestinatario = select.value;
        const texto = textarea.value.trim();

        if (!idDestinatario || !texto) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/mensagens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_remetente: usuarioLogado.id,
                    id_destinatario: idDestinatario,
                    mensagem: texto
                })
            });

            if (response.ok) {
                textarea.value = '';
                abrirPainelMensagens(localizarBotaoPorIcone('bi-chat-dots'), usuarioLogado);
            }
        } catch (error) {
            textarea.value = texto;
        }
    });
}

function atualizarBadgeBotao(botao, total) {
    if (!botao) {
        return;
    }

    let badge = botao.querySelector('.notification-badge');

    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge';
        botao.appendChild(badge);
    }

    badge.textContent = total;

    if (total <= 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'inline-flex';
    }
}
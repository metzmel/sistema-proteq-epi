const formCadastroEquipamento = document.getElementById('formCadastroEquipamento');
const formEditarEquipamento = document.getElementById('formEditarEquipamento');
const tabelaEquipamentos = document.getElementById('tabelaEquipamentos');
const inputPesquisaEquipamento = document.getElementById('inputPesquisaEquipamento');
const btnPesquisarEquipamento = document.getElementById('btnPesquisarEquipamento');
const btnLimparFiltroEquipamento = document.getElementById('btnLimparFiltroEquipamento');

const resumoFiltroEquipamento = document.getElementById('resumoFiltroEquipamento');
const resumoEstoqueTotal = document.getElementById('resumoEstoqueTotal');
const resumoEquipamentosCadastrados = document.getElementById('resumoEquipamentosCadastrados');
const resumoEquipamentosDisponiveis = document.getElementById('resumoEquipamentosDisponiveis');
const resumoEquipamentosManutencao = document.getElementById('resumoEquipamentosManutencao');
const resumoEquipamentosIndisponiveis = document.getElementById('resumoEquipamentosIndisponiveis');
const cardsResumoEquipamento = document.querySelectorAll('.resumo-card-equipamento');

let todosEquipamentos = [];
let filtroResumoEquipamentoAtual = 'todos';

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

function confirmarAcao(titulo, mensagem, textoConfirmar = 'Confirmar') {
    return new Promise(resolve => {
        let modalElement = document.getElementById('modalConfirmacaoProteq');

        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.className = 'modal fade';
            modalElement.id = 'modalConfirmacaoProteq';
            modalElement.tabIndex = -1;
            modalElement.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" style="background: var(--bg-glass); backdrop-filter: blur(25px); border: 1px solid var(--glass-border); border-radius: 22px; box-shadow: 0 20px 50px rgba(0,0,0,0.55);">
                        <div class="modal-body" style="padding: 32px;">
                            <div style="width: 52px; height: 52px; border-radius: 18px; background: #fde8e8; color: #a43838; display: grid; place-items: center; margin-bottom: 18px;">
                                <i class="bi bi-exclamation-triangle" style="font-size: 1.45rem;"></i>
                            </div>
                            <h5 id="modalConfirmacaoTitulo" style="font-weight: 900; margin-bottom: 8px; color: var(--text-light);"></h5>
                            <p id="modalConfirmacaoMensagem" style="color: var(--text-muted); font-weight: 600; line-height: 1.6; margin-bottom: 26px;"></p>
                            <div class="d-flex justify-content-end gap-2 flex-wrap">
                                <button type="button" class="btn btn-outline-light" id="btnCancelarConfirmacaoProteq" style="border-radius: 999px; padding: 10px 22px;">Cancelar</button>
                                <button type="button" class="btn" id="btnConfirmarConfirmacaoProteq" style="border-radius: 999px; padding: 10px 24px; background: #ff4d6d; color: white; font-weight: 800;">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalElement);
        }

        document.getElementById('modalConfirmacaoTitulo').textContent = titulo;
        document.getElementById('modalConfirmacaoMensagem').textContent = mensagem;
        document.getElementById('btnConfirmarConfirmacaoProteq').textContent = textoConfirmar;

        const modal = new bootstrap.Modal(modalElement);
        const btnCancelar = document.getElementById('btnCancelarConfirmacaoProteq');
        const btnConfirmar = document.getElementById('btnConfirmarConfirmacaoProteq');

        const limparEventos = () => {
            btnCancelar.replaceWith(btnCancelar.cloneNode(true));
            btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
        };

        document.getElementById('btnCancelarConfirmacaoProteq').addEventListener('click', () => {
            modal.hide();
            resolve(false);
            limparEventos();
        });

        document.getElementById('btnConfirmarConfirmacaoProteq').addEventListener('click', () => {
            modal.hide();
            resolve(true);
            limparEventos();
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
            resolve(false);
            limparEventos();
        }, { once: true });

        modal.show();
    });
}

if (formCadastroEquipamento) {
    formCadastroEquipamento.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            nome: document.getElementById('nome').value.trim(),
            tipo: document.getElementById('tipo').value.trim(),
            quantidade: document.getElementById('quantidade').value,
            status: document.getElementById('status').value,
            descricao: document.getElementById('descricao').value.trim()
        };

        if (!dados.nome || !dados.tipo || dados.quantidade === '' || !dados.status) {
            mostrarToast('Preencha todos os campos obrigatórios.', 'aviso');
            return;
        }

        if (Number(dados.quantidade) < 0) {
            mostrarToast('A quantidade não pode ser negativa.', 'aviso');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/equipamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const retorno = await response.json();

            if (response.ok) {
                mostrarToast('Equipamento cadastrado com sucesso.', 'sucesso');
                formCadastroEquipamento.reset();
            } else {
                mostrarToast(retorno.message || retorno.error?.sqlMessage || retorno.error?.message || 'Não foi possível cadastrar.', 'erro');
            }
        } catch (error) {
            mostrarToast('Erro de conexão com o servidor.', 'erro');
        }
    });
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

function quantidadeEquipamento(eq) {
    const quantidade = Number(eq.quantidade);

    if (Number.isFinite(quantidade) && quantidade > 0) {
        return quantidade;
    }

    return 0;
}

function somarEstoque(lista) {
    return lista.reduce((total, eq) => total + quantidadeEquipamento(eq), 0);
}

function textoRegistro(total) {
    return total === 1 ? '1 registro' : `${total} registros`;
}

function textoUnidade(total) {
    return total === 1 ? '1 unidade' : `${total} unidades`;
}

function aplicarEstiloCardEquipamentoAtivo() {
    cardsResumoEquipamento.forEach(card => {
        const ativo = card.dataset.filtro === filtroResumoEquipamentoAtual;

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

function atualizarTituloFiltroEquipamento(total) {
    if (!resumoFiltroEquipamento) {
        return;
    }

    const nomes = {
        todos: 'Todos',
        disponiveis: 'Disponíveis',
        manutencao: 'Manutenção',
        indisponiveis: 'Indisponíveis'
    };

    const label = nomes[filtroResumoEquipamentoAtual] || 'Todos';
    resumoFiltroEquipamento.textContent = `Filtro atual: ${label} • ${textoRegistro(total)}`;
}

function atualizarResumoBaseEquipamentos(equipamentos) {
    if (!resumoEquipamentosCadastrados) {
        return;
    }

    const disponiveis = equipamentos.filter(eq => eq.status === 'Disponível');
    const manutencao = equipamentos.filter(eq => eq.status === 'Em Manutenção');
    const indisponiveis = equipamentos.filter(eq => eq.status === 'Indisponível');
    const estoqueTotal = somarEstoque(equipamentos);

    resumoEquipamentosCadastrados.textContent = equipamentos.length;
    resumoEquipamentosDisponiveis.textContent = disponiveis.length;
    resumoEquipamentosManutencao.textContent = manutencao.length;
    resumoEquipamentosIndisponiveis.textContent = indisponiveis.length;

    if (resumoEstoqueTotal) {
        resumoEstoqueTotal.textContent = `Estoque total: ${textoUnidade(estoqueTotal)}`;
    }
}

function aplicarFiltroResumoEquipamento(lista) {
    if (filtroResumoEquipamentoAtual === 'disponiveis') {
        return lista.filter(eq => eq.status === 'Disponível');
    }

    if (filtroResumoEquipamentoAtual === 'manutencao') {
        return lista.filter(eq => eq.status === 'Em Manutenção');
    }

    if (filtroResumoEquipamentoAtual === 'indisponiveis') {
        return lista.filter(eq => eq.status === 'Indisponível');
    }

    return lista;
}

function aplicarPesquisaEquipamentos() {
    if (!tabelaEquipamentos) {
        return;
    }

    const termo = normalizarTexto(inputPesquisaEquipamento ? inputPesquisaEquipamento.value : '');

    let resultado = todosEquipamentos.filter(eq => {
        if (!termo) {
            return true;
        }

        const id = normalizarTexto(eq.id);
        const nome = normalizarTexto(eq.nome);
        const tipo = normalizarTexto(eq.tipo);
        const quantidade = normalizarTexto(eq.quantidade);
        const status = normalizarTexto(eq.status);
        const descricao = normalizarTexto(eq.descricao);

        return id.includes(termo) ||
            nome.includes(termo) ||
            tipo.includes(termo) ||
            quantidade.includes(termo) ||
            status.includes(termo) ||
            descricao.includes(termo);
    });

    resultado = aplicarFiltroResumoEquipamento(resultado);
    desenharTabelaEquipamentos(resultado);
}

function limparFiltrosEquipamentos() {
    filtroResumoEquipamentoAtual = 'todos';

    if (inputPesquisaEquipamento) {
        inputPesquisaEquipamento.value = '';
    }

    aplicarPesquisaEquipamentos();

    if (tabelaEquipamentos) {
        tabelaEquipamentos.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function classeBadgeEquipamento(status) {
    const valor = normalizarTexto(status);

    if (valor === 'disponivel') {
        return 'status-disponivel';
    }

    if (valor === 'em manutencao') {
        return 'status-manutencao';
    }

    if (valor === 'indisponivel') {
        return 'status-indisponivel';
    }

    return 'status-padrao';
}

function desenharTabelaEquipamentos(equipamentos) {
    tabelaEquipamentos.innerHTML = '';

    atualizarResumoBaseEquipamentos(todosEquipamentos);
    atualizarTituloFiltroEquipamento(equipamentos.length);
    aplicarEstiloCardEquipamentoAtivo();

    if (!equipamentos || equipamentos.length === 0) {
        tabelaEquipamentos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">Nenhum equipamento encontrado.</td>
            </tr>
        `;
        return;
    }

    equipamentos.forEach(eq => {
        const quantidade = quantidadeEquipamento(eq);
        const badgeClasse = classeBadgeEquipamento(eq.status);
        const estoqueBaixo = quantidade <= 2 && eq.status === 'Disponível';

        tabelaEquipamentos.innerHTML += `
            <tr>
                <td class="align-middle text-muted">#${escaparHTML(eq.id)}</td>
                <td class="fw-bold align-middle">${escaparHTML(eq.nome)}</td>
                <td class="align-middle">${escaparHTML(eq.tipo)}</td>
                <td class="align-middle">
                    <strong>${escaparHTML(quantidade)}</strong>
                    ${estoqueBaixo ? '<span class="status-badge status-atrasado ms-2">Estoque baixo</span>' : ''}
                </td>
                <td class="align-middle"><span class="status-badge ${badgeClasse}">${escaparHTML(eq.status)}</span></td>
                <td class="text-end align-middle">
                    <div class="d-flex justify-content-end gap-2">
                        <button onclick="editarEquipamento(${eq.id})" class="btn btn-sm" style="background: var(--accent-purple); color: white; border-radius: 8px; padding: 6px 12px; border: none;" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button onclick="excluirEquipamento(${eq.id})" class="btn btn-sm" style="background: #ff4d6d; color: white; border-radius: 8px; padding: 6px 12px; border: none;" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function configurarCardsResumoEquipamento() {
    cardsResumoEquipamento.forEach(card => {
        card.addEventListener('click', () => {
            filtroResumoEquipamentoAtual = card.dataset.filtro || 'todos';
            aplicarPesquisaEquipamentos();

            if (tabelaEquipamentos) {
                tabelaEquipamentos.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

if (tabelaEquipamentos) {
    window.carregarEquipamentos = async function() {
        try {
            const response = await fetch('http://localhost:3000/api/equipamentos');

            if (!response.ok) {
                throw new Error('Erro ao carregar equipamentos.');
            }

            todosEquipamentos = await response.json();
            aplicarPesquisaEquipamentos();
        } catch (error) {
            tabelaEquipamentos.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">Erro ao carregar equipamentos.</td>
                </tr>
            `;
        }
    };

    configurarCardsResumoEquipamento();
    carregarEquipamentos();

    if (inputPesquisaEquipamento) {
        inputPesquisaEquipamento.addEventListener('input', aplicarPesquisaEquipamentos);
    }

    if (btnPesquisarEquipamento) {
        btnPesquisarEquipamento.addEventListener('click', aplicarPesquisaEquipamentos);
    }

    if (btnLimparFiltroEquipamento) {
        btnLimparFiltroEquipamento.addEventListener('click', limparFiltrosEquipamentos);
    }

    window.editarEquipamento = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`);
            const eq = await response.json();

            document.getElementById('editId').value = eq.id;
            document.getElementById('editNome').value = eq.nome;
            document.getElementById('editTipo').value = eq.tipo;
            document.getElementById('editQuantidade').value = eq.quantidade;
            document.getElementById('editStatus').value = eq.status;
            document.getElementById('editDescricao').value = eq.descricao || '';

            const modal = new bootstrap.Modal(document.getElementById('modalEditarEquipamento'));
            modal.show();
        } catch (error) {
            mostrarToast('Erro ao buscar os dados deste equipamento.', 'erro');
        }
    };

    if (formEditarEquipamento) {
        formEditarEquipamento.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('editId').value;

            const dados = {
                nome: document.getElementById('editNome').value.trim(),
                tipo: document.getElementById('editTipo').value.trim(),
                quantidade: document.getElementById('editQuantidade').value,
                status: document.getElementById('editStatus').value,
                descricao: document.getElementById('editDescricao').value.trim()
            };

            try {
                const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const retorno = await response.json();

                if (response.ok) {
                    mostrarToast('Equipamento atualizado com sucesso.', 'sucesso');
                    const modalElement = document.getElementById('modalEditarEquipamento');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modalInstance.hide();
                    carregarEquipamentos();
                } else {
                    mostrarToast(retorno.message || retorno.error?.sqlMessage || retorno.error?.message || 'Não foi possível atualizar.', 'erro');
                }
            } catch (error) {
                mostrarToast('Erro ao tentar atualizar os dados.', 'erro');
            }
        });
    }

    window.excluirEquipamento = async function(id) {
        const confirmar = await confirmarAcao(
            'Excluir equipamento',
            'Deseja realmente excluir este equipamento? Essa ação não pode ser desfeita.',
            'Excluir'
        );

        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                mostrarToast('Equipamento excluído com sucesso.', 'sucesso');
                carregarEquipamentos();
            } else {
                mostrarToast('Não foi possível excluir este equipamento.', 'erro');
            }
        } catch (error) {
            mostrarToast('Erro ao tentar excluir.', 'erro');
        }
    };
}
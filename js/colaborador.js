const formCadastro = document.getElementById('formCadastro');
const formEditar = document.getElementById('formEditar');
const tabelaColaboradores = document.getElementById('tabelaColaboradores');
const inputPesquisa = document.getElementById('inputPesquisa');
const btnPesquisar = document.getElementById('btnPesquisar');

const resumoFiltroAtual = document.getElementById('resumoFiltroAtual');
const resumoCadastrados = document.getElementById('resumoCadastrados');
const resumoCadastradosInfo = document.getElementById('resumoCadastradosInfo');
const resumoAtivos = document.getElementById('resumoAtivos');
const resumoAtivosInfo = document.getElementById('resumoAtivosInfo');
const resumoInativos = document.getElementById('resumoInativos');
const resumoInativosInfo = document.getElementById('resumoInativosInfo');
const resumoSetores = document.getElementById('resumoSetores');
const resumoSetoresInfo = document.getElementById('resumoSetoresInfo');
const cardsResumoColaborador = document.querySelectorAll('.resumo-card-colaborador');

let todosColaboradores = [];
let filtroResumoAtual = 'todos';

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

function aplicarMascaraCPF(valor) {
    return String(valor || '')
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function limparCPF(valor) {
    return String(valor || '').replace(/\D/g, '');
}

function configurarMascaraCPF() {
    const camposCPF = [
        document.getElementById('cpf'),
        document.getElementById('editCpf')
    ].filter(Boolean);

    camposCPF.forEach(campo => {
        campo.addEventListener('input', () => {
            campo.value = aplicarMascaraCPF(campo.value);
        });
    });
}

configurarMascaraCPF();

if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cpfLimpo = limparCPF(document.getElementById('cpf').value);

        if (cpfLimpo.length !== 11) {
            mostrarToast('Informe um CPF com 11 números.', 'aviso');
            return;
        }

        const dados = {
            nome: document.getElementById('nome').value.trim(),
            cpf: cpfLimpo,
            cargo: document.getElementById('cargo').value.trim(),
            setor: document.getElementById('setor').value.trim(),
            status: document.getElementById('status').value,
            observacao: document.getElementById('observacao').value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/api/colaboradores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                mostrarToast('Colaborador cadastrado com sucesso.', 'sucesso');
                formCadastro.reset();
            } else {
                const erro = await response.json();
                mostrarToast(erro.message || 'Não foi possível cadastrar o colaborador.', 'erro');
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

function formatarData(data) {
    if (!data) {
        return '---';
    }

    const dataCriada = new Date(data);

    if (Number.isNaN(dataCriada.getTime())) {
        return '---';
    }

    return dataCriada.toLocaleDateString('pt-BR');
}

function formatarCPF(valor) {
    return aplicarMascaraCPF(valor);
}

function textoRegistro(total) {
    return total === 1 ? '1 registro' : `${total} registros`;
}

function classeStatusPadronizado(status) {
    const valor = normalizarTexto(status);

    if (valor === 'ativo') {
        return 'status-ativo';
    }

    if (valor === 'inativo') {
        return 'status-inativo';
    }

    return 'status-padrao';
}

function aplicarEstiloCardAtivo() {
    cardsResumoColaborador.forEach(card => {
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
        todos: 'Todos',
        ativos: 'Ativos',
        inativos: 'Inativos',
        setores: 'Por setor'
    };

    const label = nomes[filtroResumoAtual] || 'Todos';
    resumoFiltroAtual.textContent = `Filtro atual: ${label} • ${textoRegistro(total)}`;
}

function atualizarResumoBase(colaboradores) {
    if (!resumoCadastrados) {
        return;
    }

    const ativos = colaboradores.filter(col => col.status === 'Ativo');
    const inativos = colaboradores.filter(col => col.status === 'Inativo');

    const setores = new Set(
        colaboradores
            .map(col => normalizarTexto(col.setor))
            .filter(Boolean)
    );

    resumoCadastrados.textContent = colaboradores.length;
    resumoCadastradosInfo.textContent = 'Clique para ver todos';
    resumoAtivos.textContent = ativos.length;
    resumoAtivosInfo.textContent = 'Clique para filtrar';
    resumoInativos.textContent = inativos.length;
    resumoInativosInfo.textContent = 'Clique para filtrar';
    resumoSetores.textContent = setores.size;
    resumoSetoresInfo.textContent = 'Clique para ordenar';
}

function aplicarFiltroResumo(lista) {
    let resultado = [...lista];

    if (filtroResumoAtual === 'ativos') {
        resultado = resultado.filter(col => col.status === 'Ativo');
    }

    if (filtroResumoAtual === 'inativos') {
        resultado = resultado.filter(col => col.status === 'Inativo');
    }

    if (filtroResumoAtual === 'setores') {
        resultado.sort((a, b) => {
            const setorA = normalizarTexto(a.setor);
            const setorB = normalizarTexto(b.setor);
            const nomeA = normalizarTexto(a.nome);
            const nomeB = normalizarTexto(b.nome);

            if (setorA < setorB) {
                return -1;
            }

            if (setorA > setorB) {
                return 1;
            }

            if (nomeA < nomeB) {
                return -1;
            }

            if (nomeA > nomeB) {
                return 1;
            }

            return 0;
        });
    }

    return resultado;
}

function aplicarPesquisaColaboradores() {
    if (!tabelaColaboradores) {
        return;
    }

    const termo = normalizarTexto(inputPesquisa ? inputPesquisa.value : '');
    const termoNumerico = limparCPF(termo);

    let resultado = todosColaboradores.filter(col => {
        if (!termo) {
            return true;
        }

        const id = normalizarTexto(col.id);
        const nome = normalizarTexto(col.nome);
        const cpf = normalizarTexto(col.cpf);
        const cpfFormatado = normalizarTexto(formatarCPF(col.cpf));
        const cpfNumerico = limparCPF(col.cpf);
        const cargo = normalizarTexto(col.cargo);
        const setor = normalizarTexto(col.setor);
        const status = normalizarTexto(col.status);
        const data = normalizarTexto(formatarData(col.data_cadastro));

        return id.includes(termo) ||
            nome.includes(termo) ||
            cpf.includes(termo) ||
            cpfFormatado.includes(termo) ||
            cpfNumerico.includes(termoNumerico) ||
            cargo.includes(termo) ||
            setor.includes(termo) ||
            status.includes(termo) ||
            data.includes(termo);
    });

    resultado = aplicarFiltroResumo(resultado);
    desenharTabelaColaboradores(resultado);
}

function desenharTabelaColaboradores(colaboradores) {
    tabelaColaboradores.innerHTML = '';

    atualizarResumoBase(todosColaboradores);
    atualizarTituloFiltro(colaboradores.length);
    aplicarEstiloCardAtivo();

    if (!colaboradores || colaboradores.length === 0) {
        tabelaColaboradores.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">Nenhum colaborador encontrado.</td>
            </tr>
        `;
        return;
    }

    colaboradores.forEach(col => {
        const badgeClasse = classeStatusPadronizado(col.status);
        const dataFormatada = formatarData(col.data_cadastro);

        tabelaColaboradores.innerHTML += `
            <tr>
                <td class="align-middle text-muted">#${escaparHTML(col.id)}</td>
                <td class="fw-bold align-middle">${escaparHTML(col.nome)}</td>
                <td class="align-middle">${escaparHTML(formatarCPF(col.cpf))}</td>
                <td class="align-middle">${escaparHTML(col.cargo)}</td>
                <td class="align-middle">${escaparHTML(col.setor)}</td>
                <td class="align-middle"><span class="status-badge ${badgeClasse}">${escaparHTML(col.status)}</span></td>
                <td class="align-middle">${dataFormatada}</td>
                <td class="text-end align-middle">
                    <div class="d-flex justify-content-end gap-2">
                        <button onclick="editarColaborador(${col.id})" class="btn btn-sm" style="background: var(--accent-purple); color: white; border-radius: 8px; padding: 6px 12px; border: none;" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button onclick="excluirColaborador(${col.id})" class="btn btn-sm" style="background: #ff4d6d; color: white; border-radius: 8px; padding: 6px 12px; border: none;" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function configurarCardsResumo() {
    cardsResumoColaborador.forEach(card => {
        card.addEventListener('click', () => {
            filtroResumoAtual = card.dataset.filtro || 'todos';
            aplicarPesquisaColaboradores();

            if (tabelaColaboradores) {
                tabelaColaboradores.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

if (tabelaColaboradores) {
    window.carregarColaboradores = async function() {
        try {
            const response = await fetch('http://localhost:3000/api/colaboradores');
            todosColaboradores = await response.json();
            aplicarPesquisaColaboradores();
        } catch (error) {
            tabelaColaboradores.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">Erro ao carregar colaboradores.</td>
                </tr>
            `;
        }
    };

    configurarCardsResumo();
    carregarColaboradores();

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', aplicarPesquisaColaboradores);
    }

    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', aplicarPesquisaColaboradores);
    }

    window.editarColaborador = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`);
            const col = await response.json();

            document.getElementById('editId').value = col.id;
            document.getElementById('editNome').value = col.nome;
            document.getElementById('editCpf').value = formatarCPF(col.cpf);
            document.getElementById('editCargo').value = col.cargo;
            document.getElementById('editSetor').value = col.setor;
            document.getElementById('editStatus').value = col.status;
            document.getElementById('editObservacao').value = col.observacao || '';

            const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
            modal.show();
        } catch (error) {
            mostrarToast('Erro ao buscar os dados deste colaborador.', 'erro');
        }
    };

    if (formEditar) {
        formEditar.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('editId').value;
            const cpfLimpo = limparCPF(document.getElementById('editCpf').value);

            if (cpfLimpo.length !== 11) {
                mostrarToast('Informe um CPF com 11 números.', 'aviso');
                return;
            }

            const dados = {
                nome: document.getElementById('editNome').value.trim(),
                cpf: cpfLimpo,
                cargo: document.getElementById('editCargo').value.trim(),
                setor: document.getElementById('editSetor').value.trim(),
                status: document.getElementById('editStatus').value,
                observacao: document.getElementById('editObservacao').value.trim()
            };

            try {
                const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    mostrarToast('Informações atualizadas com sucesso.', 'sucesso');
                    const modalElement = document.getElementById('modalEditar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modalInstance.hide();
                    carregarColaboradores();
                } else {
                    const erro = await response.json();
                    mostrarToast(erro.message || 'Não foi possível atualizar.', 'erro');
                }
            } catch (error) {
                mostrarToast('Erro ao tentar atualizar os dados.', 'erro');
            }
        });
    }

    window.excluirColaborador = async function(id) {
        const confirmar = await confirmarAcao(
            'Excluir colaborador',
            'Deseja realmente excluir este colaborador? Essa ação não pode ser desfeita.',
            'Excluir'
        );

        if (!confirmar) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                mostrarToast('Colaborador excluído com sucesso.', 'sucesso');
                carregarColaboradores();
            } else {
                mostrarToast('Não foi possível excluir este colaborador.', 'erro');
            }
        } catch (error) {
            mostrarToast('Erro ao tentar excluir.', 'erro');
        }
    };
}
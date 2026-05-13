const formCadastro = document.getElementById('formCadastro');
const formEditar = document.getElementById('formEditar');
const tabelaColaboradores = document.getElementById('tabelaColaboradores');
const inputPesquisa = document.getElementById('inputPesquisa');
const btnPesquisar = document.getElementById('btnPesquisar');

if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            cargo: document.getElementById('cargo').value,
            setor: document.getElementById('setor').value,
            status: document.getElementById('status').value,
            observacao: document.getElementById('observacao').value
        };

        try {
            const response = await fetch('http://localhost:3000/api/colaboradores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert('✅ Cadastrado com sucesso no sistema!');
                formCadastro.reset();
            } else {
                const erro = await response.json();
                alert('❌ Erro: ' + erro.message);
            }
        } catch (error) {
            alert('❌ Erro de conexão com o servidor.');
        }
    });
}

if (tabelaColaboradores) {
    window.carregarColaboradores = async function(busca = '') {
        try {
            const response = await fetch('http://localhost:3000/api/colaboradores');
            let colaboradores = await response.json();

            if (busca !== '') {
                colaboradores = colaboradores.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));
            }
            
            tabelaColaboradores.innerHTML = '';
            
            colaboradores.forEach(col => {
                let statusColor = col.status === 'Ativo' ? '#00ff88' : '#ff4d6d';
                let dataFormatada = new Date(col.data_cadastro).toLocaleDateString('pt-BR');
                
                tabelaColaboradores.innerHTML += `
                    <tr>
                        <td class="align-middle">${col.id}</td>
                        <td class="fw-bold text-white align-middle">${col.nome}</td>
                        <td class="align-middle">${col.cpf}</td>
                        <td class="align-middle">${col.cargo}</td>
                        <td class="align-middle">${col.setor}</td>
                        <td class="align-middle" style="color: ${statusColor}; font-weight: bold;">${col.status}</td>
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
        } catch (error) {
            console.error(error);
        }
    }
    
    carregarColaboradores();

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            carregarColaboradores(e.target.value);
        });
    }

    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', () => {
            carregarColaboradores(inputPesquisa.value);
        });
    }

    window.editarColaborador = async function(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`);
            const col = await response.json();
            
            document.getElementById('editId').value = col.id;
            document.getElementById('editNome').value = col.nome;
            document.getElementById('editCpf').value = col.cpf;
            document.getElementById('editCargo').value = col.cargo;
            document.getElementById('editSetor').value = col.setor;
            document.getElementById('editStatus').value = col.status;
            document.getElementById('editObservacao').value = col.observacao || '';

            const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
            modal.show();
        } catch (error) {
            alert('❌ Erro ao buscar os dados deste colaborador.');
        }
    };

    if (formEditar) {
        formEditar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const dados = {
                nome: document.getElementById('editNome').value,
                cpf: document.getElementById('editCpf').value,
                cargo: document.getElementById('editCargo').value,
                setor: document.getElementById('editSetor').value,
                status: document.getElementById('editStatus').value,
                observacao: document.getElementById('editObservacao').value
            };

            try {
                const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    alert('✅ Informações atualizadas com sucesso!');
                    const modalElement = document.getElementById('modalEditar');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modalInstance.hide();
                    carregarColaboradores(); 
                } else {
                    const erro = await response.json();
                    alert('❌ Erro: ' + erro.message);
                }
            } catch (error) {
                alert('❌ Erro ao tentar atualizar os dados.');
            }
        });
    }

    window.excluirColaborador = async function(id) {
        if (confirm('⚠️ Tem certeza que deseja excluir este colaborador?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('🗑️ Colaborador excluído com sucesso!');
                    carregarColaboradores();
                }
            } catch (error) {
                alert('❌ Erro ao tentar excluir.');
            }
        }
    };
}
const formCadastroEquipamento = document.getElementById('formCadastroEquipamento');
const formEditarEquipamento = document.getElementById('formEditarEquipamento');
const tabelaEquipamentos = document.getElementById('tabelaEquipamentos');
const inputPesquisaEquipamento = document.getElementById('inputPesquisaEquipamento');
const btnPesquisarEquipamento = document.getElementById('btnPesquisarEquipamento');

if (formCadastroEquipamento) {
    formCadastroEquipamento.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = {
            nome: document.getElementById('nome').value,
            tipo: document.getElementById('tipo').value,
            quantidade: document.getElementById('quantidade').value,
            status: document.getElementById('status').value,
            descricao: document.getElementById('descricao').value
        };
        try {
            const response = await fetch('http://localhost:3000/api/equipamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (response.ok) {
                alert('✅ Equipamento cadastrado com sucesso!');
                formCadastroEquipamento.reset();
            } else {
                const erro = await response.json();
                alert('❌ Erro: ' + erro.message);
            }
        } catch (error) {
            alert('❌ Erro de conexão com o servidor.');
        }
    });
}

if (tabelaEquipamentos) {
    window.carregarEquipamentos = async function(busca = '') {
        try {
            const response = await fetch('http://localhost:3000/api/equipamentos');
            let equipamentos = await response.json();
            
            if (busca !== '') {
                equipamentos = equipamentos.filter(eq => eq.nome.toLowerCase().includes(busca.toLowerCase()));
            }
            
            tabelaEquipamentos.innerHTML = '';
            
            equipamentos.forEach(eq => {
                let statusColor = eq.status === 'Disponível' ? '#00ff88' : (eq.status === 'Em Manutenção' ? '#fcf6ba' : '#ff4d6d');
                
                tabelaEquipamentos.innerHTML += `
                    <tr>
                        <td class="align-middle">${eq.id}</td>
                        <td class="fw-bold text-white align-middle">${eq.nome}</td>
                        <td class="align-middle">${eq.tipo}</td>
                        <td class="align-middle">${eq.quantidade}</td>
                        <td class="align-middle" style="color: ${statusColor}; font-weight: bold;">${eq.status}</td>
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
        } catch (error) {
            console.error(error);
        }
    }
    
    carregarEquipamentos();

    if (inputPesquisaEquipamento) {
        inputPesquisaEquipamento.addEventListener('input', (e) => {
            carregarEquipamentos(e.target.value);
        });
    }

    if (btnPesquisarEquipamento) {
        btnPesquisarEquipamento.addEventListener('click', () => {
            carregarEquipamentos(inputPesquisaEquipamento.value);
        });
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
            alert('❌ Erro ao buscar os dados deste equipamento.');
        }
    };

    if (formEditarEquipamento) {
        formEditarEquipamento.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editId').value;
            const dados = {
                nome: document.getElementById('editNome').value,
                tipo: document.getElementById('editTipo').value,
                quantidade: document.getElementById('editQuantidade').value,
                status: document.getElementById('editStatus').value,
                descricao: document.getElementById('editDescricao').value
            };

            try {
                const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    alert('✅ Equipamento atualizado com sucesso!');
                    const modalElement = document.getElementById('modalEditarEquipamento');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modalInstance.hide();
                    carregarEquipamentos(); 
                } else {
                    const erro = await response.json();
                    alert('❌ Erro: ' + erro.message);
                }
            } catch (error) {
                alert('❌ Erro ao tentar atualizar os dados.');
            }
        });
    }

    window.excluirEquipamento = async function(id) {
        if (confirm('⚠️ Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.')) {
            try {
                const response = await fetch(`http://localhost:3000/api/equipamentos/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('🗑️ Equipamento excluído com sucesso!');
                    carregarEquipamentos();
                }
            } catch (error) {
                alert('❌ Erro ao tentar excluir.');
            }
        }
    };
}
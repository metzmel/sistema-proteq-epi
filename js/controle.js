const tabelaEmprestimos = document.getElementById('tabelaEmprestimos');
const formControle = document.getElementById('formControle');
const inputPesquisaControle = document.getElementById('inputPesquisaControle');
const selectStatus = document.getElementById('status');
const divDevolucao = document.getElementById('divDevolucao');
const campoDataPrevista = document.getElementById('data_prevista');
const containerDataPrevista = document.getElementById('containerDataPrevista');

if (tabelaEmprestimos) {
    window.carregarEmprestimos = async function(busca = '') {
        try {
            const response = await fetch('http://localhost:3000/api/emprestimos');
            let emprestimos = await response.json();
            if (busca !== '') {
                emprestimos = emprestimos.filter(e => 
                    e.nome_colaborador.toLowerCase().includes(busca.toLowerCase()) || 
                    e.nome_equipamento.toLowerCase().includes(busca.toLowerCase())
                );
            }
            tabelaEmprestimos.innerHTML = '';
            emprestimos.forEach(emp => {
                let statusColor = '#ff6600';
                if (emp.status === 'Devolvido' || emp.status === 'Fornecido') statusColor = '#00ff88';
                if (emp.status === 'Danificado' || emp.status === 'Perdido') statusColor = '#ff4d6d';
                
                let dataSaida = '-';
                if(emp.data_saida) {
                    dataSaida = new Date(emp.data_saida).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
                }

                tabelaEmprestimos.innerHTML += `
                    <tr>
                        <td class="align-middle">${emp.id}</td>
                        <td class="fw-bold text-white align-middle">${emp.nome_equipamento}</td>
                        <td class="align-middle">${emp.nome_colaborador}</td>
                        <td class="align-middle">${dataSaida}</td>
                        <td class="align-middle" style="color: ${statusColor}; font-weight: bold;">${emp.status}</td>
                        <td class="text-end align-middle">
                            <button onclick="abrirModalEdicao(${emp.id})" class="btn btn-sm" style="background: var(--accent-purple); color: white; border-radius: 8px; padding: 6px 12px; border: none;">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    carregarEmprestimos();

    if (inputPesquisaControle) {
        inputPesquisaControle.addEventListener('input', (e) => {
            carregarEmprestimos(e.target.value);
        });
    }

    window.carregarSelects = async function() {
        try {
            const resColab = await fetch('http://localhost:3000/api/colaboradores');
            const colaboradores = await resColab.json();
            const selColab = document.getElementById('id_colaborador');
            selColab.innerHTML = '<option value="">Selecione...</option>';
            colaboradores.filter(c => c.status === 'Ativo').forEach(c => {
                selColab.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
            });
            
            const resEq = await fetch('http://localhost:3000/api/equipamentos');
            const equipamentos = await resEq.json();
            const selEq = document.getElementById('id_equipamento');
            selEq.innerHTML = '<option value="">Selecione...</option>';
            equipamentos.filter(e => e.status === 'Disponível').forEach(e => {
                selEq.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
            });
        } catch (error) {
            console.error(error);
        }
    }

    window.abrirModalNovo = async function() {
        await carregarSelects();
        formControle.reset();
        document.getElementById('editId').value = '';
        document.getElementById('id_colaborador').disabled = false;
        document.getElementById('id_equipamento').disabled = false;
        document.getElementById('data_saida').disabled = false;
        
        campoDataPrevista.disabled = false;
        containerDataPrevista.style.display = 'block';
        campoDataPrevista.setAttribute('required', 'true');
        
        selectStatus.innerHTML = `
            <option value="Emprestado">Emprestado</option>
            <option value="Fornecido">Fornecido</option>
        `;
        selectStatus.value = 'Emprestado';

        divDevolucao.classList.add('d-none');
        document.getElementById('data_devolucao').removeAttribute('required');
        
        new bootstrap.Modal(document.getElementById('modalControle')).show();
    }

    window.abrirModalEdicao = async function(id) {
        await carregarSelects();
        try {
            const response = await fetch(`http://localhost:3000/api/emprestimos/${id}`);
            const emp = await response.json();
            document.getElementById('editId').value = emp.id;
            document.getElementById('id_colaborador').value = emp.id_colaborador;
            document.getElementById('id_equipamento').value = emp.id_equipamento;
            document.getElementById('data_saida').value = emp.data_saida.split('T')[0];
            campoDataPrevista.value = emp.data_prevista ? emp.data_prevista.split('T')[0] : '';
            document.getElementById('condicao_entrega').value = emp.condicao_entrega || '1';
            
            document.getElementById('id_colaborador').disabled = true;
            document.getElementById('id_equipamento').disabled = true;
            document.getElementById('data_saida').disabled = true;
            campoDataPrevista.disabled = true;
            
            selectStatus.innerHTML = `
                <option value="Emprestado">Emprestado</option>
                <option value="Fornecido">Fornecido</option>
                <option value="Devolvido">Devolvido</option>
                <option value="Danificado">Danificado</option>
                <option value="Perdido">Perdido</option>
            `;
            selectStatus.value = emp.status;

            if (emp.status === 'Fornecido') {
                containerDataPrevista.style.display = 'none';
                campoDataPrevista.removeAttribute('required');
            } else {
                containerDataPrevista.style.display = 'block';
                campoDataPrevista.removeAttribute('required'); 
            }

            if (['Danificado', 'Devolvido', 'Perdido'].includes(emp.status)) {
                divDevolucao.classList.remove('d-none');
                document.getElementById('data_devolucao').value = emp.data_devolucao ? emp.data_devolucao.split('T')[0] : '';
                document.getElementById('observacao_devolucao').value = emp.observacao_devolucao || '';
                document.getElementById('data_devolucao').setAttribute('required', 'true');
            } else {
                divDevolucao.classList.add('d-none');
                document.getElementById('data_devolucao').removeAttribute('required');
            }
            new bootstrap.Modal(document.getElementById('modalControle')).show();
        } catch (error) {
            alert('Erro ao buscar edição: ' + error.message);
        }
    }

    selectStatus.addEventListener('change', (e) => {
        if (e.target.value === 'Fornecido') {
            containerDataPrevista.style.display = 'none';
            campoDataPrevista.removeAttribute('required');
        } else {
            containerDataPrevista.style.display = 'block';
            campoDataPrevista.setAttribute('required', 'true');
        }
        
        if (['Danificado', 'Devolvido', 'Perdido'].includes(e.target.value)) {
            divDevolucao.classList.remove('d-none');
            document.getElementById('data_devolucao').setAttribute('required', 'true');
        } else {
            divDevolucao.classList.add('d-none');
            document.getElementById('data_devolucao').removeAttribute('required');
        }
    });

    formControle.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const id = document.getElementById('editId').value;
            const statusAtual = selectStatus.value;
            
            if (!id && statusAtual === 'Emprestado') {
                const dp = campoDataPrevista.value;
                const dataAtual = new Date();
                dataAtual.setMinutes(dataAtual.getMinutes() - dataAtual.getTimezoneOffset());
                const hoje = dataAtual.toISOString().split('T')[0];
                
                if (!dp || dp <= hoje) {
                    alert('❌ A data prevista (' + dp + ') deve ser maior que a data de hoje (' + hoje + ').');
                    return;
                }
            }
            
            const dados = {
                id_colaborador: document.getElementById('id_colaborador').value,
                id_equipamento: document.getElementById('id_equipamento').value,
                data_saida: document.getElementById('data_saida').value,
                data_prevista: statusAtual === 'Fornecido' ? document.getElementById('data_saida').value : campoDataPrevista.value,
                condicao_entrega: document.getElementById('condicao_entrega').value,
                status: statusAtual,
                data_devolucao: document.getElementById('data_devolucao').value || null,
                observacao_devolucao: document.getElementById('observacao_devolucao').value || ''
            };

            const url = id ? `http://localhost:3000/api/emprestimos/${id}` : 'http://localhost:3000/api/emprestimos';
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            
            if (response.ok) {
                alert('✅ Operação realizada com sucesso!');
                location.reload();
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const erro = await response.json();
                    alert('❌ Erro do Servidor: ' + (erro.error || erro.message));
                } else {
                    alert(`❌ Rota não encontrada no servidor (Erro ${response.status}). Certifique-se de que salvou o server.js e reiniciou o Node!`);
                }
            }
        } catch (error) {
            alert('❌ Erro de Conexão: ' + error.message);
        }
    });
}
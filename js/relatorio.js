const tabelaRelatorio = document.getElementById('tabelaRelatorio');
const filtroColaborador = document.getElementById('filtroColaborador');
const filtroEquipamento = document.getElementById('filtroEquipamento');
const filtroStatus = document.getElementById('filtroStatus');

if (tabelaRelatorio) {
    window.carregarRelatorio = async function() {
        try {
            const response = await fetch('http://localhost:3000/api/emprestimos');
            let emprestimos = await response.json();

            const valColab = filtroColaborador.value.toLowerCase();
            const valEquip = filtroEquipamento.value.toLowerCase();
            const valStatus = filtroStatus.value;

            emprestimos = emprestimos.filter(emp => {
                const matchColab = emp.nome_colaborador.toLowerCase().includes(valColab);
                const matchEquip = emp.nome_equipamento.toLowerCase().includes(valEquip);
                const matchStatus = valStatus === '' || emp.status === valStatus;
                return matchColab && matchEquip && matchStatus;
            });

            tabelaRelatorio.innerHTML = '';

            emprestimos.forEach(emp => {
                let statusColor = '#00ff88';
                if (emp.status === 'Danificado' || emp.status === 'Perdido') statusColor = '#ff4d6d';
                if (emp.status === 'Emprestado') statusColor = '#ffaa00';
                
                let dataSaida = new Date(emp.data_saida).toLocaleDateString('pt-BR');
                let dataDev = emp.data_devolucao ? new Date(emp.data_devolucao).toLocaleDateString('pt-BR') : '-';

                tabelaRelatorio.innerHTML += `
                    <tr>
                        <td class="align-middle">${emp.id}</td>
                        <td class="fw-bold text-white align-middle">${emp.nome_colaborador}</td>
                        <td class="align-middle">${emp.nome_equipamento}</td>
                        <td class="align-middle">${dataSaida}</td>
                        <td class="align-middle">${dataDev}</td>
                        <td class="align-middle" style="color: ${statusColor}; font-weight: bold;">${emp.status}</td>
                    </tr>
                `;
            });
        } catch (error) {}
    }

    carregarRelatorio();
    filtroColaborador.addEventListener('input', carregarRelatorio);
    filtroEquipamento.addEventListener('input', carregarRelatorio);
    filtroStatus.addEventListener('change', carregarRelatorio);
}
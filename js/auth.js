document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const paginaAtual = window.location.pathname.split('/').pop();

    if (!usuario && paginaAtual !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    if (usuario) {
        const elementosNome = document.querySelectorAll('.user-name');
        const elementosCargo = document.querySelectorAll('.user-role');
        elementosNome.forEach(el => el.textContent = usuario.nome);
        elementosCargo.forEach(el => el.textContent = usuario.cargo);
    }

    const btnSair = document.getElementById('lnkSair');
    if (btnSair) {
        btnSair.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }

    const sidebarFooterSair = document.querySelector('.sidebar-footer a');
    if (sidebarFooterSair) {
        sidebarFooterSair.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});
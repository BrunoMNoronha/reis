// Funções de UI e navegação
export function navigateToView(viewId) {
    const views = document.querySelectorAll('.view');
    const tabs = document.querySelectorAll('.view-toggle .tab');
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    views.forEach(view => view.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));
    // Ativa view
    const view = document.getElementById(viewId);
    if (view) view.classList.add('active');
    // Ativa tab
    const tab = Array.from(tabs).find(t => t.dataset.view === viewId);
    if (tab) tab.classList.add('active');
    // Ativa sidebar desktop e mobile
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.dataset.view === viewId) link.classList.add('active');
    });
    // Fecha menu mobile se aberto
    const sidebarMobile = document.getElementById('sidebar-mobile');
    if (sidebarMobile && sidebarMobile.classList.contains('open')) {
        closeSidebarMobile();
    }
}

export function openSidebarMobile() {
    const sidebarMobile = document.getElementById('sidebar-mobile');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    sidebarMobile.classList.add('open');
    sidebarOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    sidebarMobile.focus();
    document.body.style.overflow = 'hidden';
}

export function closeSidebarMobile() {
    const sidebarMobile = document.getElementById('sidebar-mobile');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    sidebarMobile.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

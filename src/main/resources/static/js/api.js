const API_BASE = 'http://localhost:8080/api';

function getToken() {
    return localStorage.getItem('spotbite_token');
}

function saveToken(token) {
    localStorage.setItem('spotbite_token', token);
}

function logout() {
    localStorage.removeItem('spotbite_token');
    localStorage.removeItem('spotbite_user');
    window.location.href = '/login.html';
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
}

/* ── DARK MODE ── */
function initDarkMode() {
    const saved = localStorage.getItem('spotbite_theme');
    if (saved === 'dark') {
        document.body.classList.add('dark');
    }
    updateToggleBtn();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('spotbite_theme', isDark ? 'dark' : 'light');
    updateToggleBtn();
}

function updateToggleBtn() {
    const btn = document.getElementById('dark-toggle');
    if (!btn) return;
    const isDark = document.body.classList.contains('dark');
    btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
}
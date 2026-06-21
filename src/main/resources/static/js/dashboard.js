let allBookings = [];

window.onload = async function() {
    initDarkMode();
    const user = localStorage.getItem('spotbite_user');
    if (!user) { window.location.href = '/login.html'; return; }
    const u = JSON.parse(user);

    document.getElementById('user-name').textContent = u.name;
    document.getElementById('user-email').textContent = u.email;
    document.getElementById('user-avatar').textContent = u.name.charAt(0).toUpperCase();
    document.getElementById('profile-name').textContent = u.name;
    document.getElementById('profile-email').textContent = u.email;
    document.getElementById('profile-avatar').textContent = u.name.charAt(0).toUpperCase();

    await loadFavorites();
};

function showSection(section, el) {
    ['favorites','bookings','reviews','profile'].forEach(s => {
        document.getElementById(`section-${s}`).style.display = s === section ? 'block' : 'none';
    });
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');

    if (section === 'bookings' && allBookings.length === 0) loadBookings();
    if (section === 'reviews') loadMyReviews();
}

async function loadFavorites() {
    try {
        const favorites = await apiCall('/favorites');
        const grid = document.getElementById('favorites-grid');
        if (!favorites.length) {
            grid.innerHTML = `<div class="empty-state"><span class="empty-icon">❤️</span><h3>No favorites yet</h3><p>Save restaurants you love!</p></div>`;
            return;
        }
        grid.innerHTML = favorites.map(f => {
            const r = f.restaurant || f;
            return `
            <div class="restaurant-card" onclick="window.location.href='/restaurant.html?id=${r.id}'">
                <div class="img-wrap">
                    <img src="${r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}"
                         alt="${r.name}"
                         onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'"/>
                    <div class="img-overlay"></div>
                </div>
                <div class="card-body">
                    <h3>${r.name}</h3>
                    <div class="card-meta">
                        <span class="rating">⭐ ${r.avgRating ? r.avgRating.toFixed(1) : '0.0'}</span>
                        <span>${r.cuisineType || 'Various'}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch(e) {
        document.getElementById('favorites-grid').innerHTML =
            `<div class="empty-state"><span class="empty-icon">❤️</span><h3>No favorites yet</h3></div>`;
    }
}

async function loadBookings() {
    try {
        allBookings = await apiCall('/bookings/my');
        const list = document.getElementById('bookings-list');
        if (!allBookings.length) {
            list.innerHTML = `<div class="empty-state"><span class="empty-icon">📅</span><h3>No bookings yet</h3><p>Reserve a table from any restaurant page!</p></div>`;
            return;
        }
        list.innerHTML = allBookings.map(b => `
            <div class="booking-card">
                <div style="display:flex;align-items:center;gap:14px">
                    <img src="${b.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'}"
                         style="width:50px;height:50px;border-radius:10px;object-fit:cover"
                         onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'"/>
                    <div>
                        <p style="font-weight:700;cursor:pointer" onclick="window.location.href='/restaurant.html?id=${b.restaurantId}'">${b.restaurantName}</p>
                        <p style="font-size:13px;color:var(--text-muted)">${new Date(b.bookingDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} at ${b.bookingTime.substring(0,5)} · ${b.guestCount} guests</p>
                        ${b.specialRequest ? `<p style="font-size:12px;color:var(--text-muted);margin-top:2px">"${b.specialRequest}"</p>` : ''}
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="booking-status status-${b.status}">${b.status}</span>
                    ${(b.status === 'PENDING' || b.status === 'CONFIRMED') ?
                        `<button class="btn-icon btn-del" onclick="cancelBooking(${b.id})" title="Cancel">✕</button>` : ''}
                </div>
            </div>`).join('');
    } catch(e) {
        document.getElementById('bookings-list').innerHTML =
            `<div class="empty-state"><span class="empty-icon">📅</span><h3>No bookings yet</h3></div>`;
    }
}

async function cancelBooking(id) {
    if (!confirm('Cancel this booking?')) return;
    try {
        await apiCall(`/bookings/${id}/cancel`, 'PUT');
        showToast('Booking cancelled', 'success');
        await loadBookings();
    } catch(e) {
        showToast('Could not cancel booking', 'error');
    }
}

async function loadMyReviews() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = `<div class="empty-state"><span class="empty-icon">⭐</span><h3>Coming soon</h3><p>View all your reviews here</p></div>`;
}

function showToast(msg, type = '') {
    const t = document.querySelector('.toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 3000);
}
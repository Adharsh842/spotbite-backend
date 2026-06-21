let restaurantId = new URLSearchParams(window.location.search).get('id');
let selectedRating = 0;

window.onload = async function() {
    initDarkMode();
    updateNavbar();
    if (!restaurantId) { window.location.href = '/search.html'; return; }
    setMinBookingDate();
    await loadRestaurant();
    await loadDishes();
    await loadReviews();
    if (getToken()) await loadMyBookingsForThisRestaurant();
    setInterval(refreshCrowd, 60000);
};

function setMinBookingDate() {
    const dateInput = document.getElementById('b-date');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

async function loadRestaurant() {
    try {
        const r = await apiCall(`/restaurants/${restaurantId}`);
        document.title = `SpotBite — ${r.name}`;

        const img = document.getElementById('hero-img');
        img.src = r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
        img.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
        };

        document.getElementById('restaurant-name').textContent = r.name;
        document.getElementById('rating-badge').textContent = `⭐ ${r.avgRating ? r.avgRating.toFixed(1) : '0.0'}`;
        document.getElementById('cuisine-badge').textContent = `🍽️ ${r.cuisineType || 'Various'}`;
        document.getElementById('city-badge').textContent = `📍 ${r.city || 'Unknown'}`;
        document.getElementById('price-badge').textContent = `💰 ${getPriceSymbol(r.priceRange)}`;

        const ob = document.getElementById('open-badge');
        ob.textContent = r.isOpen ? '● Open' : '● Closed';
        ob.className = r.isOpen ? 'open-badge' : 'open-badge closed-badge';
        ob.style.position = 'static';

        document.getElementById('info-content').innerHTML = `
            <div style="display:grid;gap:16px">
                <div style="display:flex;gap:12px;align-items:flex-start">
                    <span style="font-size:20px">📍</span>
                    <div>
                        <p style="font-weight:600;margin-bottom:2px">Address</p>
                        <p style="color:var(--text-muted)">${r.address || 'Not available'}, ${r.city || ''}</p>
                    </div>
                </div>
                <div style="display:flex;gap:12px;align-items:flex-start">
                    <span style="font-size:20px">📞</span>
                    <div>
                        <p style="font-weight:600;margin-bottom:2px">Phone</p>
                        <p style="color:var(--text-muted)">${r.phone || 'Not available'}</p>
                    </div>
                </div>
                <div style="display:flex;gap:12px;align-items:flex-start">
                    <span style="font-size:20px">🍽️</span>
                    <div>
                        <p style="font-weight:600;margin-bottom:2px">Cuisine</p>
                        <p style="color:var(--text-muted)">${r.cuisineType || 'Various'}</p>
                    </div>
                </div>
                <div style="display:flex;gap:12px;align-items:flex-start">
                    <span style="font-size:20px">💰</span>
                    <div>
                        <p style="font-weight:600;margin-bottom:2px">Price Range</p>
                        <p style="color:var(--text-muted)">${r.priceRange || 'N/A'}</p>
                    </div>
                </div>
                <div style="display:flex;gap:12px;align-items:flex-start">
                    <span style="font-size:20px">📝</span>
                    <div>
                        <p style="font-weight:600;margin-bottom:2px">About</p>
                        <p style="color:var(--text-muted)">${r.description || 'No description available'}</p>
                    </div>
                </div>
            </div>`;

        updateCrowdUI(r.crowdStatus || 'LOW');

    } catch(e) {
        console.error('Failed to load restaurant:', e);
        document.getElementById('restaurant-name').textContent = 'Failed to load';
        showToast('Could not load restaurant details', 'error');
    }
}

async function loadDishes() {
    try {
        const dishes = await apiCall(`/restaurants/${restaurantId}/dishes`);
        const grid = document.getElementById('dishes-grid');
        if (!dishes.length) {
            grid.innerHTML = `<div class="empty-state"><span class="empty-icon">🍽️</span><h3>No dishes listed yet</h3></div>`;
            return;
        }
        grid.innerHTML = dishes.map(d => `
            <div class="dish-card animate-fade-up">
                <img src="${d.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}"
                     alt="${d.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'"/>
                <div>
                    <h4>${d.name} ${d.isFamous ? '<span class="famous-tag">⭐ Must Try</span>' : ''}</h4>
                    <p style="font-size:13px;color:var(--text-muted);margin:4px 0">${d.description || ''}</p>
                    <p class="dish-price">₹${d.price || '0'}</p>
                </div>
            </div>`).join('');
    } catch(e) {
        console.error('Failed to load dishes:', e);
    }
}

async function loadReviews() {
    try {
        const reviews = await apiCall(`/restaurants/${restaurantId}/reviews`);
        const list = document.getElementById('reviews-list');
        if (!reviews.length) {
            list.innerHTML = `<div class="empty-state"><span class="empty-icon">💬</span><h3>No reviews yet</h3><p>Be the first to review!</p></div>`;
            return;
        }
        list.innerHTML = reviews.map(r => `
            <div class="review-card animate-fade-up">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="avatar">${(r.userName || 'U').charAt(0).toUpperCase()}</div>
                        <div>
                            <p style="font-weight:700;font-size:15px">${r.userName || 'Anonymous'}</p>
                            <p style="font-size:12px;color:var(--text-muted)">${new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                        </div>
                    </div>
                    <div class="star-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                </div>
                <p class="review-text">${r.comment || ''}</p>
            </div>`).join('');
    } catch(e) {
        console.error('Failed to load reviews:', e);
    }
}

function setRating(n) {
    selectedRating = n;
    document.querySelectorAll('#star-picker span').forEach((s, i) => {
        s.classList.toggle('active', i < n);
    });
}

async function submitReview() {
    if (!getToken()) { window.location.href = '/login.html'; return; }
    if (!selectedRating) { showToast('Please select a star rating', 'error'); return; }
    const comment = document.getElementById('review-comment').value.trim();
    try {
        await apiCall(`/restaurants/${restaurantId}/reviews`, 'POST', { rating: selectedRating, comment });
        showToast('Review submitted! ⭐', 'success');
        document.getElementById('review-comment').value = '';
        setRating(0);
        await loadReviews();
    } catch(e) {
        showToast('Could not submit review', 'error');
    }
}

/* ── BOOKING ── */

async function submitBooking() {
    if (!getToken()) { window.location.href = '/login.html'; return; }

    const date = document.getElementById('b-date').value;
    const time = document.getElementById('b-time').value;
    const guests = document.getElementById('b-guests').value;
    const request = document.getElementById('b-request').value.trim();

    if (!date || !time) {
        showToast('Please select a date and time', 'error');
        return;
    }

    try {
        await apiCall(`/restaurants/${restaurantId}/bookings`, 'POST', {
            bookingDate: date,
            bookingTime: time,
            guestCount: parseInt(guests),
            specialRequest: request
        });
        showToast('Table reserved! Waiting for confirmation 📅', 'success');
        document.getElementById('b-request').value = '';
        await loadMyBookingsForThisRestaurant();
    } catch(e) {
        showToast(e.message || 'Could not complete booking', 'error');
    }
}

async function loadMyBookingsForThisRestaurant() {
    try {
        const bookings = await apiCall('/bookings/my');
        const myRestaurantBookings = bookings.filter(b => b.restaurantId == restaurantId);

        const section = document.getElementById('my-bookings-section');
        const list = document.getElementById('my-bookings-list');

        if (!myRestaurantBookings.length) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        list.innerHTML = myRestaurantBookings.map(b => `
            <div class="booking-card">
                <div>
                    <p style="font-weight:700;font-size:14px">${new Date(b.bookingDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} at ${b.bookingTime.substring(0,5)}</p>
                    <p style="font-size:13px;color:var(--text-muted)">${b.guestCount} guests${b.specialRequest ? ' · ' + b.specialRequest : ''}</p>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                    <span class="booking-status status-${b.status}">${b.status}</span>
                    ${(b.status === 'PENDING' || b.status === 'CONFIRMED') ?
                        `<button class="btn-icon btn-del" onclick="cancelMyBooking(${b.id})" title="Cancel">✕</button>` : ''}
                </div>
            </div>`).join('');
    } catch(e) {
        console.error('Failed to load bookings:', e);
    }
}

async function cancelMyBooking(bookingId) {
    if (!confirm('Cancel this booking?')) return;
    try {
        await apiCall(`/bookings/${bookingId}/cancel`, 'PUT');
        showToast('Booking cancelled', 'success');
        await loadMyBookingsForThisRestaurant();
    } catch(e) {
        showToast('Could not cancel booking', 'error');
    }
}

async function refreshCrowd() {
    try {
        const data = await apiCall(`/crowd/${restaurantId}`);
        updateCrowdUI(data.status);
    } catch(e) {}
}

function updateCrowdUI(status) {
    const badge = document.getElementById('crowd-badge');
    badge.textContent = status;
    badge.className = `crowd-badge crowd-${status.toLowerCase()}`;
    document.getElementById('crowd-label').textContent = status;
    const fill = document.getElementById('crowd-fill');
    fill.className = `crowd-bar-fill crowd-fill-${status.toLowerCase()}`;
}

function showTab(tab, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    btn.classList.add('active');
}

function getPriceSymbol(p) {
    return p === 'BUDGET' ? '₹ Budget' : p === 'MODERATE' ? '₹₹ Moderate' : p === 'PREMIUM' ? '₹₹₹ Premium' : '₹';
}

function updateNavbar() {
    const user = localStorage.getItem('spotbite_user');
    const el = document.getElementById('nav-auth');
    if (!el) return;
    if (user) {
        const u = JSON.parse(user);
        el.innerHTML = `
            <span style="font-weight:600;color:var(--secondary);font-size:14px">Hi, ${u.name}! 👋</span>
            <a href="/dashboard.html"><button class="btn btn-outline">Dashboard</button></a>
            <button class="btn btn-primary" onclick="logout()">Logout</button>
            <button class="dark-toggle" id="dark-toggle" onclick="toggleDarkMode()">🌙 Dark</button>`;
    } else {
        el.innerHTML = `
            <a href="/login.html"><button class="btn btn-outline">Login</button></a>
            <a href="/register.html"><button class="btn btn-primary">Sign Up</button></a>
            <button class="dark-toggle" id="dark-toggle" onclick="toggleDarkMode()">🌙 Dark</button>`;
    }
    updateToggleBtn();
}

function showToast(msg, type = '') {
    const t = document.querySelector('.toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 3000);
}
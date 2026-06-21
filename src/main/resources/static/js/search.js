let allRestaurants = [];
let filters = { cuisine: '', price: '', rating: '', crowd: '' };

window.onload = async function() {
    updateNavbar();
    await loadRestaurants();

    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
        document.getElementById('search-input').value = params.get('q');
    }
    if (params.get('cuisine')) {
        filters.cuisine = params.get('cuisine');
        document.querySelectorAll('.filter-chip').forEach(c => {
            if (c.dataset.cuisine === filters.cuisine) {
                c.classList.add('active');
            }
        });
    }
    applyFilters();
};

async function loadRestaurants() {
    showSkeletons();
    try {
        // Load ALL restaurants on first load
        allRestaurants = await apiCall('/restaurants');
        console.log('Loaded restaurants:', allRestaurants.length);
        applyFilters();
    } catch(e) {
        console.error('Error loading restaurants:', e);
        document.getElementById('results-grid').innerHTML =
            `<div class="empty-state" style="grid-column:1/-1">
                <span class="empty-icon">😕</span>
                <h3>Could not load restaurants</h3>
                <p>Make sure Spring Boot is running on port 8080</p>
            </div>`;
    }
}
function showSkeletons() {
    document.getElementById('results-grid').innerHTML = Array(6).fill(`
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div style="padding:16px">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text-sm"></div>
            </div>
        </div>
    `).join('');
}

function setFilter(type, value, el) {
    filters[type] = value;
    el.closest('div').querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    applyFilters();
}

function clearFilters() {
    filters = { cuisine: '', price: '', rating: '', crowd: '' };
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.filter-chip').forEach((c, i) => {
        c.classList.remove('active');
        if (c.textContent.trim() === 'All') c.classList.add('active');
    });
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('search-input').value.trim();
    let results = [...allRestaurants];

    // Text filter
    if (query) {
        results = results.filter(r =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            (r.city && r.city.toLowerCase().includes(query.toLowerCase())) ||
            (r.cuisineType && r.cuisineType.toLowerCase().includes(query.toLowerCase()))
        );
    }

    // Cuisine filter
    if (filters.cuisine) {
        results = results.filter(r =>
            r.cuisineType && r.cuisineType.toLowerCase()
                .includes(filters.cuisine.toLowerCase())
        );
    }

    // Price filter
    if (filters.price) {
        results = results.filter(r => r.priceRange === filters.price);
    }

    // Rating filter
    if (filters.rating) {
        results = results.filter(r =>
            r.avgRating && r.avgRating >= parseFloat(filters.rating)
        );
    }

    // Crowd filter
    if (filters.crowd) {
        results = results.filter(r => r.crowdStatus === filters.crowd);
    }

    sortAndDisplay(results);
}

function sortResults() { applyFilters(); }

function sortAndDisplay(results) {
    const sort = document.getElementById('sort-select').value;
    results.sort((a, b) => {
        if (sort === 'rating') return (b.avgRating || 0) - (a.avgRating || 0);
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'price-low') return getPriceNum(a.priceRange) - getPriceNum(b.priceRange);
        if (sort === 'price-high') return getPriceNum(b.priceRange) - getPriceNum(a.priceRange);
        return 0;
    });

    document.getElementById('count').textContent = results.length;

    if (results.length === 0) {
        document.getElementById('results-grid').innerHTML = `
            <div class="empty-state" style="grid-column:1/-1">
                <span class="empty-icon">🍽️</span>
                <h3>No restaurants found</h3>
                <p>Try different filters or search terms</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>`;
        return;
    }

    document.getElementById('results-grid').innerHTML = results.map((r, i) => `
        <div class="restaurant-card animate-fade-up" style="animation-delay:${i * 0.05}s" onclick="window.location.href='/restaurant.html?id=${r.id}'">
            <div class="img-wrap">
                <img src="${r.imageUrl || 'https://via.placeholder.com/400x200/FF6B35/white?text=' + encodeURIComponent(r.name)}" alt="${r.name}" loading="lazy"/>
                <div class="img-overlay"></div>
                <span class="${r.isOpen ? 'open-badge' : 'open-badge closed-badge'}">${r.isOpen ? '● Open' : '● Closed'}</span>
                <button class="fav-btn" onclick="event.stopPropagation();toggleFavorite(${r.id},this)" title="Save">♡</button>
            </div>
            <div class="card-body">
                <h3>${r.name}</h3>
                <div class="card-meta">
                    <span class="rating">⭐ ${r.avgRating ? r.avgRating.toFixed(1) : '0.0'}</span>
                    <span>${r.cuisineType || 'Various'}</span>
                    <span class="price-tag">${getPriceSymbol(r.priceRange)}</span>
                </div>
                <div class="card-meta">
                    <span>📍 ${r.city || 'Unknown'}</span>
                    <span class="crowd-badge crowd-${(r.crowdStatus || 'low').toLowerCase()}">${r.crowdStatus || 'LOW'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function doSearch() { applyFilters(); }

function getPriceNum(p) { return p === 'BUDGET' ? 1 : p === 'MODERATE' ? 2 : p === 'PREMIUM' ? 3 : 2; }
function getPriceSymbol(p) { return p === 'BUDGET' ? '₹' : p === 'MODERATE' ? '₹₹' : p === 'PREMIUM' ? '₹₹₹' : '₹'; }

async function toggleFavorite(restaurantId, btn) {
    if (!getToken()) { window.location.href = '/login.html'; return; }
    try {
        if (btn.classList.contains('active')) {
            await apiCall(`/favorites/${restaurantId}`, 'DELETE');
            btn.classList.remove('active');
            btn.textContent = '♡';
            showToast('Removed from favorites');
        } else {
            await apiCall(`/favorites/${restaurantId}`, 'POST');
            btn.classList.add('active');
            btn.textContent = '❤️';
            showToast('Saved to favorites! ❤️', 'success');
        }
    } catch (e) { showToast('Please login first', 'error'); }
}

function updateNavbar() {
    const user = localStorage.getItem('spotbite_user');
    const el = document.getElementById('nav-auth');
    if (!el) return;
    if (user) {
        const u = JSON.parse(user);
        el.innerHTML = `<span style="font-weight:600;color:var(--secondary)">Hi, ${u.name}! 👋</span>
        <a href="/dashboard.html"><button class="btn btn-outline">Dashboard</button></a>
        <button class="btn btn-primary" onclick="logout()">Logout</button>`;
    } else {
        el.innerHTML = `<a href="/login.html"><button class="btn btn-outline">Login</button></a>
        <a href="/register.html"><button class="btn btn-primary">Sign Up</button></a>`;
    }
}

function showToast(msg, type = '') {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 3000);
}
// Load restaurants when page opens
window.onload = function () {
    initDarkMode();
    loadRestaurants();
    updateNavbar();
};

async function loadRestaurants() {
    try {
        const restaurants = await apiCall('/restaurants');
        displayRestaurants(restaurants);
    } catch (error) {
        document.getElementById('restaurant-list').innerHTML =
            '<div class="empty-state"><h3>No restaurants found</h3><p>Check back soon!</p></div>';
    }
}

function displayRestaurants(restaurants) {
    const container = document.getElementById('restaurant-list');

    if (restaurants.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No restaurants yet</h3><p>Admin will add restaurants soon!</p></div>';
        return;
    }

    container.innerHTML = restaurants.map(r => `
        <div class="restaurant-card" onclick="window.location.href='/restaurant.html?id=${r.id}'">
            <div class="img-wrap">
                <img src="${r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}"
                     alt="${r.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'"/>
                <div class="img-overlay"></div>
                <span class="${r.isOpen ? 'open-badge' : 'open-badge closed-badge'}">
                    ● ${r.isOpen ? 'Open' : 'Closed'}
                </span>
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
                    <span class="crowd-badge crowd-${(r.crowdStatus || 'low').toLowerCase()}">
                        ${r.crowdStatus || 'LOW'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function getPriceSymbol(priceRange) {
    if (priceRange === 'BUDGET') return '₹';
    if (priceRange === 'MODERATE') return '₹₹';
    if (priceRange === 'PREMIUM') return '₹₹₹';
    return '₹';
}

function searchRestaurants() {
    const query = document.getElementById('search-input').value;
    window.location.href = `/search.html?q=${query}`;
}

function filterByCuisine(cuisine) {
    window.location.href = `/search.html?cuisine=${cuisine}`;
}

function updateNavbar() {
    const user = localStorage.getItem('spotbite_user');
    const el = document.getElementById('nav-auth');
    if (!el) return;
    if (user) {
        const userData = JSON.parse(user);
        el.innerHTML = `
            <span style="font-weight:600;color:var(--secondary);font-size:14px">Hi, ${userData.name}! 👋</span>
            <a href="/dashboard.html"><button class="btn btn-outline">Dashboard</button></a>
            <button class="btn btn-primary" onclick="logout()">Logout</button>
            <button class="dark-toggle" id="dark-toggle" onclick="toggleDarkMode()">🌙 Dark</button>
        `;
    } else {
        el.innerHTML = `
            <a href="/login.html"><button class="btn btn-outline">Login</button></a>
            <a href="/register.html"><button class="btn btn-primary">Sign Up</button></a>
            <button class="dark-toggle" id="dark-toggle" onclick="toggleDarkMode()">🌙 Dark</button>
        `;
    }
    updateToggleBtn();
}
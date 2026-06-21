let allRestaurants = [], allUsers = [], allReviews = [], allBookings = [];
let uploadedImageUrl = '';

window.onload = async function() {
    initDarkMode();
    const user = localStorage.getItem('spotbite_user');
    if (!user) { window.location.href = '/login.html'; return; }
    const u = JSON.parse(user);
    if (u.role !== 'ADMIN') { window.location.href = '/index.html'; return; }
    document.getElementById('admin-name').textContent = u.name;
    await loadStats();
    await loadRestaurants();
    setupDragDrop();
};

async function loadStats() {
    try {
        const stats = await apiCall('/admin/stats');
        document.getElementById('stat-restaurants').textContent = stats.restaurants;
        document.getElementById('stat-users').textContent = stats.users;
        document.getElementById('stat-reviews').textContent = stats.reviews;
    } catch(e) {}
}

async function loadRestaurants() {
    try {
        allRestaurants = await apiCall('/admin/restaurants');
        renderRestaurants(allRestaurants);
    } catch(e) { showToast('Failed to load restaurants','error'); }
}

function renderRestaurants(list) {
    document.getElementById('restaurants-table').innerHTML = list.map(r => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <img src="${r.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'}"
                         style="width:40px;height:40px;border-radius:8px;object-fit:cover"
                         onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80'"/>
                    <div>
                        <p style="font-weight:700">${r.name}</p>
                        <p style="font-size:12px;color:var(--text-muted)">${r.address || ''}</p>
                    </div>
                </div>
            </td>
            <td>📍 ${r.city || '-'}</td>
            <td>${r.cuisineType || '-'}</td>
            <td><span style="background:#fff8e1;color:#f57f17;padding:3px 8px;border-radius:6px;font-weight:700">⭐ ${r.avgRating ? r.avgRating.toFixed(1) : '0.0'}</span></td>
            <td><span class="badge ${r.isOpen ? 'badge-open' : 'badge-closed'}">${r.isOpen ? '● Open' : '● Closed'}</span></td>
            <td>
                <select class="crowd-select" onchange="updateCrowd(${r.id}, this.value)">
                    <option value="LOW" ${getCrowdStatus(r.id)==='LOW'?'selected':''}>🟢 Low</option>
                    <option value="MODERATE" ${getCrowdStatus(r.id)==='MODERATE'?'selected':''}>🟡 Moderate</option>
                    <option value="HIGH" ${getCrowdStatus(r.id)==='HIGH'?'selected':''}>🔴 High</option>
                    <option value="FULL" ${getCrowdStatus(r.id)==='FULL'?'selected':''}>⛔ Full</option>
                </select>
            </td>
            <td>
                <button class="btn-icon btn-edit" onclick="openEditModal(${r.id})" title="Edit">✏️</button>
                <button class="btn-icon btn-del" onclick="deleteRestaurant(${r.id},'${r.name}')" title="Delete">🗑️</button>
            </td>
        </tr>`).join('');
}

async function loadUsers() {
    try {
        allUsers = await apiCall('/admin/users');
        renderUsers(allUsers);
    } catch(e) { showToast('Failed to load users','error'); }
}

function renderUsers(list) {
    document.getElementById('users-table').innerHTML = list.map(u => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">${u.name.charAt(0).toUpperCase()}</div>
                    <span style="font-weight:600">${u.name}</span>
                </div>
            </td>
            <td style="color:var(--text-muted)">${u.email}</td>
            <td><span class="badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
            <td style="color:var(--text-muted)">${new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
            <td>${u.role !== 'ADMIN' ? `<button class="btn-icon btn-del" onclick="deleteUser(${u.id},'${u.name}')" title="Delete">🗑️</button>` : '<span style="color:var(--text-muted);font-size:12px">Protected</span>'}</td>
        </tr>`).join('');
}

async function loadReviews() {
    try {
        allReviews = await apiCall('/admin/reviews');
        renderReviews(allReviews);
    } catch(e) { showToast('Failed to load reviews','error'); }
}

function renderReviews(list) {
    document.getElementById('reviews-table').innerHTML = list.map(r => `
        <tr>
            <td style="font-weight:600">${r.userName || 'Unknown'}</td>
            <td>${r.restaurantName || '-'}</td>
            <td><span style="color:#FFB800;font-size:16px">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></td>
            <td style="max-width:200px;color:var(--text-muted)">${r.comment || '-'}</td>
            <td style="color:var(--text-muted)">${new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
            <td><button class="btn-icon btn-del" onclick="deleteReview(${r.id})" title="Delete">🗑️</button></td>
        </tr>`).join('');
}

/* ── BOOKINGS ── */

async function loadBookings() {
    try {
        allBookings = await apiCall('/admin/bookings');
        renderBookings(allBookings);
    } catch(e) { showToast('Failed to load bookings','error'); }
}

function renderBookings(list) {
    if (!list.length) {
        document.getElementById('bookings-table').innerHTML =
            `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:32px">No bookings yet</td></tr>`;
        return;
    }
    document.getElementById('bookings-table').innerHTML = list.map(b => `
        <tr>
            <td>
                <p style="font-weight:600">${b.userName}</p>
                <p style="font-size:12px;color:var(--text-muted)">${b.userEmail}</p>
            </td>
            <td>${b.restaurantName}</td>
            <td>${new Date(b.bookingDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})} · ${b.bookingTime.substring(0,5)}</td>
            <td>${b.guestCount}</td>
            <td style="max-width:160px;color:var(--text-muted);font-size:13px">${b.specialRequest || '-'}</td>
            <td><span class="badge status-badge-${b.status}" style="background:${bookingStatusColor(b.status).bg};color:${bookingStatusColor(b.status).fg}">${b.status}</span></td>
            <td>
                ${b.status === 'PENDING' ? `
                    <button class="btn-icon btn-edit" onclick="setBookingStatus(${b.id},'CONFIRMED')" title="Confirm">✅</button>
                    <button class="btn-icon btn-del" onclick="setBookingStatus(${b.id},'REJECTED')" title="Reject">❌</button>
                ` : `<button class="btn-icon btn-del" onclick="deleteBookingRow(${b.id})" title="Delete">🗑️</button>`}
            </td>
        </tr>`).join('');
}

function bookingStatusColor(status) {
    const map = {
        PENDING: { bg: '#fff8e1', fg: '#f57f17' },
        CONFIRMED: { bg: '#e8f5e9', fg: '#2e7d32' },
        REJECTED: { bg: '#ffebee', fg: '#c62828' },
        CANCELLED: { bg: '#eceff1', fg: '#607d8b' }
    };
    return map[status] || map.PENDING;
}

async function setBookingStatus(id, status) {
    try {
        await apiCall(`/admin/bookings/${id}/status?status=${status}`, 'PUT');
        showToast(`Booking ${status.toLowerCase()} ✅`, 'success');
        await loadBookings();
    } catch(e) {
        showToast('Failed to update booking', 'error');
    }
}

async function deleteBookingRow(id) {
    if (!confirm('Delete this booking record?')) return;
    try {
        await apiCall(`/admin/bookings/${id}`, 'DELETE');
        showToast('Booking deleted', 'success');
        await loadBookings();
    } catch(e) {
        showToast('Failed to delete booking', 'error');
    }
}

function filterBookingsByStatus(status) {
    const filtered = status ? allBookings.filter(b => b.status === status) : allBookings;
    renderBookings(filtered);
}

function showTab(tab, btn) {
    ['restaurants','bookings','users','reviews'].forEach(t => {
        document.getElementById(`tab-${t}`).style.display = t === tab ? 'block' : 'none';
    });
    document.querySelectorAll('.section-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (tab === 'bookings' && allBookings.length === 0) loadBookings();
    if (tab === 'users' && allUsers.length === 0) loadUsers();
    if (tab === 'reviews' && allReviews.length === 0) loadReviews();
}

function filterTable(tableId, query) {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
    });
}

function openAddModal() {
    document.getElementById('modal-title').textContent = '➕ Add Restaurant';
    document.getElementById('edit-id').value = '';
    ['name','city','cuisine','price','phone','address','image','desc'].forEach(f => {
        const el = document.getElementById(`f-${f}`);
        if (el) el.value = f === 'open' ? 'true' : '';
    });
    document.getElementById('f-open').value = 'true';
    resetImageUpload();
    document.getElementById('restaurant-modal').classList.add('open');
}

function openEditModal(id) {
    const r = allRestaurants.find(x => x.id === id);
    if (!r) return;
    document.getElementById('modal-title').textContent = '✏️ Edit Restaurant';
    document.getElementById('edit-id').value = r.id;
    document.getElementById('f-name').value = r.name || '';
    document.getElementById('f-city').value = r.city || '';
    document.getElementById('f-cuisine').value = r.cuisineType || '';
    document.getElementById('f-price').value = r.priceRange || '';
    document.getElementById('f-phone').value = r.phone || '';
    document.getElementById('f-address').value = r.address || '';
    document.getElementById('f-image').value = r.imageUrl || '';
    document.getElementById('f-desc').value = r.description || '';
    document.getElementById('f-open').value = r.isOpen ? 'true' : 'false';

    resetImageUpload();
    if (r.imageUrl) {
        uploadedImageUrl = r.imageUrl;
        showImagePreview(r.imageUrl);
    }

    document.getElementById('restaurant-modal').classList.add('open');
}

function closeModal() {
    document.getElementById('restaurant-modal').classList.remove('open');
    resetImageUpload();
}

/* ── IMAGE UPLOAD ── */

function resetImageUpload() {
    uploadedImageUrl = '';
    document.getElementById('f-image-file').value = '';
    document.getElementById('image-preview-wrap').classList.remove('show');
    document.getElementById('upload-zone').style.display = 'block';
    document.getElementById('upload-progress').classList.remove('show');
}

function showImagePreview(url) {
    document.getElementById('image-preview').src = url;
    document.getElementById('image-preview-wrap').classList.add('show');
    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('f-image').value = url;
}

function removeImage() {
    resetImageUpload();
    document.getElementById('f-image').value = '';
}

function handleManualUrl() {
    const url = document.getElementById('f-image').value.trim();
    if (url) {
        uploadedImageUrl = url;
        document.getElementById('image-preview').src = url;
        document.getElementById('image-preview-wrap').classList.add('show');
        document.getElementById('upload-zone').style.display = 'none';
    } else {
        resetImageUpload();
    }
}

async function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    await uploadFile(file);
}

async function uploadFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be under 5MB', 'error');
        return;
    }

    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('upload-progress').classList.add('show');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        uploadedImageUrl = data.url;
        showImagePreview(data.url);
        showToast('Image uploaded! 📷', 'success');

    } catch (e) {
        showToast(e.message || 'Upload failed', 'error');
        document.getElementById('upload-zone').style.display = 'block';
    } finally {
        document.getElementById('upload-progress').classList.remove('show');
    }
}

function setupDragDrop() {
    const zone = document.getElementById('upload-zone');
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    });
}

/* ── SAVE / DELETE ── */

async function saveRestaurant() {
    const name = document.getElementById('f-name').value.trim();
    const city = document.getElementById('f-city').value.trim();
    if (!name || !city) { showToast('Name and City are required','error'); return; }

    const data = {
        name,
        city,
        cuisineType: document.getElementById('f-cuisine').value,
        priceRange: document.getElementById('f-price').value,
        phone: document.getElementById('f-phone').value,
        address: document.getElementById('f-address').value,
        imageUrl: uploadedImageUrl || document.getElementById('f-image').value,
        description: document.getElementById('f-desc').value,
        isOpen: document.getElementById('f-open').value === 'true'
    };

    const editId = document.getElementById('edit-id').value;
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        if (editId) {
            await apiCall(`/admin/restaurants/${editId}`, 'PUT', data);
            showToast('Restaurant updated! ✅','success');
        } else {
            await apiCall('/admin/restaurants', 'POST', data);
            showToast('Restaurant added! 🎉','success');
        }
        closeModal();
        await loadRestaurants();
        await loadStats();
    } catch(e) {
        showToast('Failed to save restaurant','error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Restaurant';
    }
}

async function deleteRestaurant(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
        await apiCall(`/admin/restaurants/${id}`, 'DELETE');
        showToast('Restaurant deleted','success');
        await loadRestaurants();
        await loadStats();
    } catch(e) { showToast('Failed to delete','error'); }
}

async function deleteUser(id, name) {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
        await apiCall(`/admin/users/${id}`, 'DELETE');
        showToast('User deleted','success');
        await loadUsers();
        await loadStats();
    } catch(e) { showToast('Failed to delete user','error'); }
}

async function deleteReview(id) {
    if (!confirm('Delete this review?')) return;
    try {
        await apiCall(`/admin/reviews/${id}`, 'DELETE');
        showToast('Review deleted','success');
        await loadReviews();
        await loadStats();
    } catch(e) { showToast('Failed to delete review','error'); }
}

async function updateCrowd(restaurantId, status) {
    try {
        await apiCall(`/crowd/${restaurantId}?status=${status}`, 'PUT');
        showToast(`Crowd status updated to ${status} ✅`, 'success');
    } catch(e) { showToast('Failed to update crowd status','error'); }
}

function getCrowdStatus(id) { return 'LOW'; }

function showToast(msg, type = '') {
    const t = document.querySelector('.toast');
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

document.getElementById('restaurant-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
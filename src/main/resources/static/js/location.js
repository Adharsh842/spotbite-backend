// SpotBite Location Service
// Handles GPS detection, Google Maps, and nearby restaurant display

const LocationService = {

    userLat: null,
    userLng: null,
    map: null,
    markers: [],

    /**
     * Step 1 — Ask user for GPS permission and get coordinates
     */
	getUserLocation(onSuccess, onError) {
	    if (!navigator.geolocation) {
	        onError('Geolocation is not supported by your browser');
	        return;
	    }

	    navigator.geolocation.getCurrentPosition(
	        (position) => {
	            this.userLat = position.coords.latitude;
	            this.userLng = position.coords.longitude;
	            console.log(`Location found: ${this.userLat}, ${this.userLng}`);
	            onSuccess(this.userLat, this.userLng);
	        },
	        (error) => {
	            const messages = {
	                1: 'Location permission denied. Please allow location access.',
	                2: 'Location unavailable. Check your GPS.',
	                3: 'Location request timed out. Try again.'
	            };
	            onError(messages[error.code] || 'Unknown location error');
	        },
	        {
	            enableHighAccuracy: true,
	            timeout: 10000,
	            maximumAge: 300000
	        }
	    );
	},

    /**
     * Step 2 — Fetch nearby restaurants from Spring Boot API
     */
    async fetchNearby(lat, lng, radius = 5) {
        const response = await fetch(
            `http://localhost:8080/api/location/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );
        if (!response.ok) throw new Error('Failed to fetch nearby restaurants');
        return await response.json();
    },

    /**
     * Step 3 — Initialize Google Map centered on user
     */
    initMap(lat, lng, containerId = 'map') {
        const mapEl = document.getElementById(containerId);
        if (!mapEl || !window.google) return;

        this.map = new google.maps.Map(mapEl, {
            center: { lat, lng },
            zoom: 14,
            styles: this.getMapStyles(),
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        // Add user location marker (blue dot)
        new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: 'You are here',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            }
        });

        // Add pulsing circle around user
        new google.maps.Circle({
            map: this.map,
            center: { lat, lng },
            radius: 500, // 500 meters
            fillColor: '#4285F4',
            fillOpacity: 0.08,
            strokeColor: '#4285F4',
            strokeOpacity: 0.3,
            strokeWeight: 1
        });
    },

    /**
     * Step 4 — Add restaurant markers to map
     */
    addRestaurantMarkers(nearbyList) {
        // Clear old markers
        this.markers.forEach(m => m.setMap(null));
        this.markers = [];

        const infoWindow = new google.maps.InfoWindow();

        nearbyList.forEach(item => {
            const r = item.restaurant;
            if (!r.latitude || !r.longitude) return;

            const marker = new google.maps.Marker({
                position: { lat: r.latitude, lng: r.longitude },
                map: this.map,
                title: r.name,
                icon: {
                    url: this.getMarkerIcon(r.avgRating),
                    scaledSize: new google.maps.Size(36, 36)
                },
                animation: google.maps.Animation.DROP
            });

            // Click marker → show popup
            marker.addListener('click', () => {
                infoWindow.setContent(`
                    <div style="font-family:'Segoe UI',sans-serif;padding:8px;max-width:220px">
                        <h3 style="margin:0 0 6px;font-size:15px;color:#2D3142">${r.name}</h3>
                        <p style="margin:0 0 4px;font-size:13px;color:#666">
                            🍽️ ${r.cuisineType || 'Various'} &nbsp;·&nbsp;
                            ⭐ ${r.avgRating ? r.avgRating.toFixed(1) : '0.0'}
                        </p>
                        <p style="margin:0 0 8px;font-size:13px;color:#FF6B35;font-weight:700">
                            📍 ${item.distanceLabel}
                        </p>
                        <a href="/restaurant.html?id=${r.id}"
                           style="display:block;background:#FF6B35;color:white;text-align:center;
                                  padding:8px;border-radius:8px;font-size:13px;font-weight:600;
                                  text-decoration:none">
                            View Restaurant →
                        </a>
                    </div>
                `);
                infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
        });
    },

    /**
     * Get colored marker based on rating
     */
    getMarkerIcon(rating) {
        // Use different colored markers based on rating
        // These are simple colored circle SVGs encoded as data URIs
        const color = rating >= 4.5 ? '%234CAF50'   // green — excellent
                    : rating >= 4.0 ? '%23FF6B35'   // orange — good
                    : rating >= 3.0 ? '%23FFC107'   // yellow — okay
                    : '%23e53935';                   // red — poor

        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Ccircle cx='18' cy='18' r='16' fill='${color}' stroke='white' stroke-width='2'/%3E%3Ctext x='18' y='23' text-anchor='middle' fill='white' font-size='14'%3E%F0%9F%8D%BD%3C/text%3E%3C/svg%3E`;
    },

    /**
     * Clean minimal map style (Zomato-like)
     */
    getMapStyles() {
        return [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8f9' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#fafafa' }] }
        ];
    }
};
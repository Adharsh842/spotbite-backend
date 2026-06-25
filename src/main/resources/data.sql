-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role, created_at)
SELECT 'Admin', 'admin@spotbite.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@spotbite.com');

-- Restaurants
INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Vasantha Bhavan', 'Famous South Indian vegetarian restaurant since 1952', 'Dindigul Road, Thillai Nagar', 'Trichy', 'Indian', 'BUDGET', 4.5, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800', '0431-2760001', true, NOW(), 10.805, 78.694, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Vasantha Bhavan');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Hotel Annapoorna', 'Best biryani and chettinad dishes in Trichy', 'Racquet Court Road, Cantonment', 'Trichy', 'Indian', 'MODERATE', 4.3, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', '0431-2414141', true, NOW(), 10.797, 78.685, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Hotel Annapoorna');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Pizza Hut Trichy', 'International pizza chain with dine-in', 'Bharathidasan Salai, Thillai Nagar', 'Trichy', 'Italian', 'MODERATE', 4.1, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', '0431-4040404', true, NOW(), 10.802, 78.692, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Pizza Hut Trichy');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Chinese Garden', 'Authentic Chinese and Indo-Chinese cuisine', 'Williams Road, Cantonment', 'Trichy', 'Chinese', 'MODERATE', 4.2, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', '0431-2415151', true, NOW(), 10.799, 78.688, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Chinese Garden');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Sree Krishna Sweets', 'Famous sweets and snacks shop with cafe', 'Big Bazaar Street, Srirangam', 'Trichy', 'Desserts', 'BUDGET', 4.6, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800', '0431-2431234', true, NOW(), 10.8651, 78.694, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Sree Krishna Sweets');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Burger King Trichy', 'Popular fast food chain with flame-grilled burgers', 'Puthur, NH 45', 'Trichy', 'Fast Food', 'BUDGET', 4.0, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', '0431-3030303', true, NOW(), 10.785, 78.705, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Burger King Trichy');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Ocean Pearl', 'Fresh seafood specialties from coastal Tamil Nadu', 'Salai Road, Ariyamangalam', 'Trichy', 'Seafood', 'PREMIUM', 4.4, 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800', '0431-2661234', true, NOW(), 10.79, 78.72, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Ocean Pearl');

INSERT INTO restaurants (name, description, address, city, cuisine_type, price_range, avg_rating, image_url, phone, is_open, created_at, latitude, longitude, max_capacity_per_slot)
SELECT 'Taco Bell Express', 'Mexican fast food with wraps and nachos', 'Junction Road, Thillai Nagar', 'Trichy', 'Mexican', 'BUDGET', 3.9, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', '0431-2780000', true, NOW(), 10.803, 78.69, 10
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Taco Bell Express');
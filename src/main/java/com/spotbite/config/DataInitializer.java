package com.spotbite.config;

import com.spotbite.model.Restaurant;
import com.spotbite.model.User;
import com.spotbite.repository.RestaurantRepository;
import com.spotbite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedRestaurants();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@spotbite.com")) return;
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@spotbite.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        System.out.println("✅ Admin user created: admin@spotbite.com / admin123");
    }

    private void seedRestaurants() {
        if (restaurantRepository.count() > 0) return;

        Object[][] data = {
            {"Vasantha Bhavan", "Famous South Indian vegetarian restaurant since 1952",
             "Dindigul Road, Thillai Nagar", "Trichy", "Indian", "BUDGET", 4.5,
             "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
             "0431-2760001", true, 10.805, 78.694},
            {"Hotel Annapoorna", "Best biryani and chettinad dishes in Trichy",
             "Racquet Court Road, Cantonment", "Trichy", "Indian", "MODERATE", 4.3,
             "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
             "0431-2414141", true, 10.797, 78.685},
            {"Pizza Hut Trichy", "International pizza chain with dine-in",
             "Bharathidasan Salai, Thillai Nagar", "Trichy", "Italian", "MODERATE", 4.1,
             "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
             "0431-4040404", true, 10.802, 78.692},
            {"Chinese Garden", "Authentic Chinese and Indo-Chinese cuisine",
             "Williams Road, Cantonment", "Trichy", "Chinese", "MODERATE", 4.2,
             "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
             "0431-2415151", true, 10.799, 78.688},
            {"Sree Krishna Sweets", "Famous sweets and snacks shop with cafe",
             "Big Bazaar Street, Srirangam", "Trichy", "Desserts", "BUDGET", 4.6,
             "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
             "0431-2431234", true, 10.8651, 78.694},
            {"Burger King Trichy", "Popular fast food chain with flame-grilled burgers",
             "Puthur, NH 45", "Trichy", "Fast Food", "BUDGET", 4.0,
             "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
             "0431-3030303", true, 10.785, 78.705},
            {"Ocean Pearl", "Fresh seafood specialties from coastal Tamil Nadu",
             "Salai Road, Ariyamangalam", "Trichy", "Seafood", "PREMIUM", 4.4,
             "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800",
             "0431-2661234", true, 10.79, 78.72},
            {"Taco Bell Express", "Mexican fast food with wraps and nachos",
             "Junction Road, Thillai Nagar", "Trichy", "Mexican", "BUDGET", 3.9,
             "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
             "0431-2780000", true, 10.803, 78.69}
        };

        for (Object[] d : data) {
            Restaurant r = new Restaurant();
            r.setName((String) d[0]);
            r.setDescription((String) d[1]);
            r.setAddress((String) d[2]);
            r.setCity((String) d[3]);
            r.setCuisineType((String) d[4]);
            r.setPriceRange(Restaurant.PriceRange.valueOf((String) d[5]));
            r.setAvgRating((Double) d[6]);
            r.setImageUrl((String) d[7]);
            r.setPhone((String) d[8]);
            r.setIsOpen((Boolean) d[9]);
            r.setLatitude((Double) d[10]);
            r.setLongitude((Double) d[11]);
            r.setMaxCapacityPerSlot(10);
            restaurantRepository.save(r);
        }
        System.out.println("✅ 8 restaurants seeded successfully");
    }
}
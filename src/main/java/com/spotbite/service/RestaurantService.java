package com.spotbite.service;

import com.spotbite.model.Restaurant;
import com.spotbite.repository.RestaurantRepository;
import com.spotbite.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<Restaurant> searchRestaurants(String city, String cuisine, Double minRating) {
        return restaurantRepository.searchRestaurants(city, cuisine, minRating);
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant updated) {
        Restaurant existing = getRestaurantById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setCuisineType(updated.getCuisineType());
        existing.setPriceRange(updated.getPriceRange());
        existing.setImageUrl(updated.getImageUrl());
        existing.setPhone(updated.getPhone());
        existing.setIsOpen(updated.getIsOpen());
        return restaurantRepository.save(existing);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public void updateAvgRating(Long restaurantId) {
        List<com.spotbite.model.Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        if (reviews.isEmpty()) return;
        double avg = reviews.stream()
                .mapToInt(com.spotbite.model.Review::getRating)
                .average().orElse(0.0);
        Restaurant r = getRestaurantById(restaurantId);
        r.setAvgRating(Math.round(avg * 10.0) / 10.0);
        restaurantRepository.save(r);
    }
}
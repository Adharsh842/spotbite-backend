package com.spotbite.service;

import com.spotbite.model.Restaurant;
import com.spotbite.model.Review;
import com.spotbite.model.User;
import com.spotbite.repository.RestaurantRepository;
import com.spotbite.repository.ReviewRepository;
import com.spotbite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public long countUsers() {
        return userRepository.count();
    }

    public long countRestaurants() {
        return restaurantRepository.count();
    }

    public long countReviews() {
        return reviewRepository.count();
    }
}
package com.spotbite.service;

import com.spotbite.model.Restaurant;
import com.spotbite.model.Review;
import com.spotbite.model.User;
import com.spotbite.repository.ReviewRepository;
import com.spotbite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserRepository userRepository;

    public List<Review> getReviewsByRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }

    public Review addReview(Long restaurantId, String userEmail, Integer rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);

        if (reviewRepository.existsByRestaurantIdAndUserId(restaurantId, user.getId())) {
            throw new RuntimeException("You have already reviewed this restaurant");
        }

        Review review = new Review();
        review.setRestaurant(restaurant);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepository.save(review);
        restaurantService.updateAvgRating(restaurantId);
        return saved;
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
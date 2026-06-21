package com.spotbite.service;

import com.spotbite.model.Favorite;
import com.spotbite.model.Restaurant;
import com.spotbite.model.User;
import com.spotbite.repository.FavoriteRepository;
import com.spotbite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantService restaurantService;

    public List<Favorite> getFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUserId(user.getId());
    }

    public Favorite addFavorite(String userEmail, Long restaurantId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);

        if (favoriteRepository.existsByUserIdAndRestaurantId(user.getId(), restaurantId)) {
            throw new RuntimeException("Already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setRestaurant(restaurant);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userEmail, Long restaurantId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Favorite favorite = favoriteRepository
                .findByUserIdAndRestaurantId(user.getId(), restaurantId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }
}
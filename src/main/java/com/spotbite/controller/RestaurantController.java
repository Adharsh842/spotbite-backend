package com.spotbite.controller;

import com.spotbite.model.Dish;
import com.spotbite.model.Restaurant;
import com.spotbite.repository.DishRepository;
import com.spotbite.repository.RestaurantRepository;
import com.spotbite.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DishRepository dishRepository;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAll(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String q) {

        if (q != null && !q.trim().isEmpty()) {
            return ResponseEntity.ok(restaurantRepository.searchByQuery(q.trim()));
        }

        if (city != null || cuisine != null || minRating != null) {
            return ResponseEntity.ok(
                restaurantRepository.searchRestaurants(city, cuisine, minRating));
        }

        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping
    public ResponseEntity<Restaurant> create(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> update(
            @PathVariable Long id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/dishes")
    public ResponseEntity<List<Dish>> getDishes(@PathVariable Long id) {
        return ResponseEntity.ok(dishRepository.findByRestaurantId(id));
    }

    @PostMapping("/{id}/dishes")
    public ResponseEntity<Dish> addDish(
            @PathVariable Long id, @RequestBody Dish dish) {
        dish.setRestaurant(restaurantService.getRestaurantById(id));
        return ResponseEntity.ok(dishRepository.save(dish));
    }
}
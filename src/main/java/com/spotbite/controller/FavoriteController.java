package com.spotbite.controller;

import com.spotbite.model.Favorite;
import com.spotbite.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<Favorite>> getFavorites(Authentication auth) {
        return ResponseEntity.ok(favoriteService.getFavorites(auth.getName()));
    }

    @PostMapping("/{restaurantId}")
    public ResponseEntity<Favorite> addFavorite(
            @PathVariable Long restaurantId, Authentication auth) {
        return ResponseEntity.ok(favoriteService.addFavorite(auth.getName(), restaurantId));
    }

    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long restaurantId, Authentication auth) {
        favoriteService.removeFavorite(auth.getName(), restaurantId);
        return ResponseEntity.noContent().build();
    }
}
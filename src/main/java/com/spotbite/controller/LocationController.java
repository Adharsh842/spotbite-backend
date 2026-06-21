package com.spotbite.controller;

import com.spotbite.service.LocationService;
import com.spotbite.service.LocationService.NearbyRestaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyRestaurant>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5.0") double radius) {
        return ResponseEntity.ok(
            locationService.findNearbyRestaurants(lat, lng, radius));
    }

    @GetMapping("/distance")
    public ResponseEntity<String> getDistance(
            @RequestParam double userLat,
            @RequestParam double userLng,
            @RequestParam double restLat,
            @RequestParam double restLng) {
        double distance = locationService.calculateDistance(
            userLat, userLng, restLat, restLng);
        String label = distance < 1.0
            ? (int)(distance * 1000) + " m away"
            : String.format("%.1f km away", distance);
        return ResponseEntity.ok(label);
    }
}
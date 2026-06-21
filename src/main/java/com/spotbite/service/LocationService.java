package com.spotbite.service;

import com.spotbite.model.Restaurant;
import com.spotbite.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Haversine Formula — calculates distance between two GPS coordinates
     * This is the same formula used by Google Maps, Zomato, etc.
     */
    public double calculateDistance(double lat1, double lon1,
                                    double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    /**
     * Find all restaurants within given radius (km) from user location
     * Returns sorted by nearest first
     */
    public List<NearbyRestaurant> findNearbyRestaurants(
            double userLat, double userLon, double radiusKm) {

        List<Restaurant> all = restaurantRepository.findAll();

        return all.stream()
            .filter(r -> r.getLatitude() != null && r.getLongitude() != null)
            .map(r -> {
                double distance = calculateDistance(
                    userLat, userLon,
                    r.getLatitude(), r.getLongitude()
                );
                return new NearbyRestaurant(r, distance);
            })
            .filter(nr -> nr.getDistanceKm() <= radiusKm)
            .sorted(Comparator.comparingDouble(NearbyRestaurant::getDistanceKm))
            .collect(Collectors.toList());
    }

    /**
     * Wrapper class that adds distance info to a Restaurant
     */
    public static class NearbyRestaurant {
        private Restaurant restaurant;
        private double distanceKm;
        private String distanceLabel;

        public NearbyRestaurant(Restaurant restaurant, double distanceKm) {
            this.restaurant = restaurant;
            this.distanceKm = distanceKm;
            this.distanceLabel = formatDistance(distanceKm);
        }

        private String formatDistance(double km) {
            if (km < 1.0) {
                return (int)(km * 1000) + " m away";
            }
            return String.format("%.1f km away", km);
        }

        public Restaurant getRestaurant() { return restaurant; }
        public double getDistanceKm() { return distanceKm; }
        public String getDistanceLabel() { return distanceLabel; }
    }

       
}
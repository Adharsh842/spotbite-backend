package com.spotbite.repository;

import com.spotbite.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByCity(String city);

    List<Restaurant> findByCuisineType(String cuisineType);

    @Query("SELECT r FROM Restaurant r WHERE " +
           "(:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:cuisine IS NULL OR LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :cuisine, '%'))) AND " +
           "(:minRating IS NULL OR r.avgRating >= :minRating)")
    List<Restaurant> searchRestaurants(
        @Param("city") String city,
        @Param("cuisine") String cuisine,
        @Param("minRating") Double minRating
    );

    @Query("SELECT r FROM Restaurant r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisineType) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchByQuery(@Param("query") String query);
}
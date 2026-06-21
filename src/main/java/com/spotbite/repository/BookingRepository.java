package com.spotbite.repository;

import com.spotbite.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByRestaurantIdOrderByBookingDateDescBookingTimeDesc(Long restaurantId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.restaurant.id = :restaurantId " +
           "AND b.bookingDate = :date AND b.bookingTime = :time " +
           "AND b.status IN ('PENDING', 'CONFIRMED')")
    long countActiveBookingsForSlot(
        @Param("restaurantId") Long restaurantId,
        @Param("date") LocalDate date,
        @Param("time") LocalTime time
    );
}
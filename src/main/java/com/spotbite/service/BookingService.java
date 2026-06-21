package com.spotbite.service;

import com.spotbite.dto.BookingRequest;
import com.spotbite.model.Booking;
import com.spotbite.model.Restaurant;
import com.spotbite.model.User;
import com.spotbite.repository.BookingRepository;
import com.spotbite.repository.RestaurantRepository;
import com.spotbite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Booking createBooking(String userEmail, Long restaurantId, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (request.getGuestCount() == null || request.getGuestCount() < 1) {
            throw new RuntimeException("Guest count must be at least 1");
        }
        if (request.getBookingDate() == null || request.getBookingTime() == null) {
            throw new RuntimeException("Booking date and time are required");
        }

        int maxCapacity = restaurant.getMaxCapacityPerSlot() != null
                ? restaurant.getMaxCapacityPerSlot() : 10;
        long currentBookings = bookingRepository.countActiveBookingsForSlot(
                restaurantId, request.getBookingDate(), request.getBookingTime());

        if (currentBookings >= maxCapacity) {
            throw new RuntimeException("This time slot is fully booked. Please choose another time.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRestaurant(restaurant);
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setGuestCount(request.getGuestCount());
        booking.setSpecialRequest(request.getSpecialRequest());
        booking.setStatus(Booking.Status.PENDING);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getRestaurantBookings(Long restaurantId) {
        return bookingRepository.findByRestaurantIdOrderByBookingDateDescBookingTimeDesc(restaurantId);
    }

    public Booking updateStatus(Long bookingId, Booking.Status status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }
        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);
    }

    public void deleteBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}
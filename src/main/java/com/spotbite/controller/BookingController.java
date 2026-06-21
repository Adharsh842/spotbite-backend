package com.spotbite.controller;

import com.spotbite.dto.BookingRequest;
import com.spotbite.dto.BookingResponse;
import com.spotbite.model.Booking;
import com.spotbite.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/restaurants/{id}/bookings")
    public ResponseEntity<?> createBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request,
            Authentication auth) {
        try {
            Booking booking = bookingService.createBooking(auth.getName(), id, request);
            return ResponseEntity.ok(new BookingResponse(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication auth) {
        List<BookingResponse> bookings = bookingService.getUserBookings(auth.getName())
                .stream().map(BookingResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication auth) {
        try {
            bookingService.cancelBooking(id, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Booking cancelled"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings()
                .stream().map(BookingResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/admin/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.Status status) {
        try {
            Booking booking = bookingService.updateStatus(id, status);
            return ResponseEntity.ok(new BookingResponse(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
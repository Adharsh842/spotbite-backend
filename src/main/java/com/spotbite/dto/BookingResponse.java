package com.spotbite.dto;

import com.spotbite.model.Booking;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponse {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantImage;
    private String userName;
    private String userEmail;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private Integer guestCount;
    private String specialRequest;
    private String status;
    private LocalDateTime createdAt;

    public BookingResponse(Booking b) {
        this.id = b.getId();
        this.restaurantId = b.getRestaurant().getId();
        this.restaurantName = b.getRestaurant().getName();
        this.restaurantImage = b.getRestaurant().getImageUrl();
        this.userName = b.getUser().getName();
        this.userEmail = b.getUser().getEmail();
        this.bookingDate = b.getBookingDate();
        this.bookingTime = b.getBookingTime();
        this.guestCount = b.getGuestCount();
        this.specialRequest = b.getSpecialRequest();
        this.status = b.getStatus().name();
        this.createdAt = b.getCreatedAt();
    }

    public Long getId() { return id; }
    public Long getRestaurantId() { return restaurantId; }
    public String getRestaurantName() { return restaurantName; }
    public String getRestaurantImage() { return restaurantImage; }
    public String getUserName() { return userName; }
    public String getUserEmail() { return userEmail; }
    public LocalDate getBookingDate() { return bookingDate; }
    public LocalTime getBookingTime() { return bookingTime; }
    public Integer getGuestCount() { return guestCount; }
    public String getSpecialRequest() { return specialRequest; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
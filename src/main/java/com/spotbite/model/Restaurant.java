package com.spotbite.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    private String address;
    private String city;
    @Column(name = "cuisine_type")
    private String cuisineType;
    @Enumerated(EnumType.STRING)
    @Column(name = "price_range")
    private PriceRange priceRange;
    @Column(name = "avg_rating")
    private Double avgRating = 0.0;
    @Column(name = "image_url")
    private String imageUrl;
    private String phone;
    @Column(name = "is_open")
    private Boolean isOpen = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    public enum PriceRange {
        BUDGET, MODERATE, PREMIUM
    }
    @Column(name = "latitude")
    private Double latitude;
    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "max_capacity_per_slot")
    private Integer maxCapacityPerSlot = 10;

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }
    public PriceRange getPriceRange() { return priceRange; }
    public void setPriceRange(PriceRange priceRange) { this.priceRange = priceRange; }
    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean isOpen) { this.isOpen = isOpen; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Integer getMaxCapacityPerSlot() { return maxCapacityPerSlot; }
    public void setMaxCapacityPerSlot(Integer maxCapacityPerSlot) { this.maxCapacityPerSlot = maxCapacityPerSlot; }
}
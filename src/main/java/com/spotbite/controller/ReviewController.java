package com.spotbite.controller;

import com.spotbite.dto.ReviewRequest;
import com.spotbite.dto.ReviewResponse;
import com.spotbite.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/restaurants/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long id) {
        List<ReviewResponse> reviews = reviewService.getReviewsByRestaurant(id)
                .stream().map(ReviewResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/restaurants/{id}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            Authentication auth) {
        String email = auth.getName();
        ReviewResponse response = new ReviewResponse(
                reviewService.addReview(id, email, request.getRating(), request.getComment()));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
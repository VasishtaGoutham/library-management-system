package com.example.demo.controller;

import com.example.demo.dto.BookRatingSummary;
import com.example.demo.dto.CreateReviewRequest;
import com.example.demo.dto.ReviewResponse;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/books/{bookId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<BookRatingSummary> getBookReviews(@PathVariable Long bookId) {
        return ResponseEntity.ok(reviewService.getBookReviews(bookId));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.addOrUpdateReview(bookId, userDetails.getId(), request));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long bookId,
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        reviewService.deleteReview(reviewId, userDetails.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}

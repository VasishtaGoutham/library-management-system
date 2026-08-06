package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRatingSummary {
    private Long bookId;
    private Double averageRating;
    private Long totalReviews;
    private List<ReviewResponse> reviews;
}

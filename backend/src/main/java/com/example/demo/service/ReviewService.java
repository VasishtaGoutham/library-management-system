package com.example.demo.service;

import com.example.demo.dto.BookRatingSummary;
import com.example.demo.dto.CreateReviewRequest;
import com.example.demo.dto.ReviewResponse;
import com.example.demo.model.Book;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookRatingSummary getBookReviews(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        List<Review> reviews = reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
        Double avgRating = reviewRepository.getAverageRatingByBookId(bookId);
        Long totalReviews = reviewRepository.countReviewsByBookId(bookId);

        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(r -> ReviewResponse.builder()
                        .id(r.getId())
                        .bookId(r.getBook().getId())
                        .studentId(r.getStudent().getId())
                        .studentName(r.getStudent().getFullName())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return BookRatingSummary.builder()
                .bookId(book.getId())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .reviews(reviewResponses)
                .build();
    }

    public ReviewResponse addOrUpdateReview(Long bookId, Long studentId, CreateReviewRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Review review = reviewRepository.findByBookIdAndStudentId(bookId, studentId)
                .orElseGet(() -> Review.builder()
                        .book(book)
                        .student(student)
                        .build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(saved.getId())
                .bookId(saved.getBook().getId())
                .studentId(saved.getStudent().getId())
                .studentName(saved.getStudent().getFullName())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public void deleteReview(Long reviewId, Long currentUserId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!isAdmin && !review.getStudent().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
    }
}

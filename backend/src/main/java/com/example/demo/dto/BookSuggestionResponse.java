package com.example.demo.dto;

import com.example.demo.model.BookRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookSuggestionResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String reason;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private BookRequestStatus status;
    private String adminComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

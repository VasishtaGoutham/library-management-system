package com.example.demo.dto;

import com.example.demo.model.HoldStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoldResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String coverImageUrl;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private HoldStatus status;
    private Integer queuePosition;
    private LocalDateTime requestDate;
    private LocalDateTime fulfilledAt;
}

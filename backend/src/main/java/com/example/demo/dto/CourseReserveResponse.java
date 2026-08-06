package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CourseReserveResponse {
    private Long id;
    private String courseCode;
    private String courseName;
    private String department;
    private String instructor;
    private String semester;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookIsbn;
    private int availableCopies;
    private String requirementType;
    private LocalDateTime createdAt;
}

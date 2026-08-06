package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCourseReserveRequest {
    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Instructor is required")
    private String instructor;

    @NotBlank(message = "Semester is required")
    private String semester;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotBlank(message = "Requirement type is required")
    private String requirementType; // REQUIRED or RECOMMENDED
}

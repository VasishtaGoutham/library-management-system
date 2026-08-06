package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private Long totalBooks;
    private Long totalCopies;
    private Long availableCopies;
    private Long totalIssued;
    private Long totalOverdue;
    private Long totalStudents;
    private BigDecimal totalFinesCollected;
}

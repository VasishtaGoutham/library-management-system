package com.example.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BorrowRequest {
    @NotNull
    private Long studentId;

    @NotBlank
    private String barcode;

    @Min(1)
    @Max(14)
    private Integer borrowDays;
}

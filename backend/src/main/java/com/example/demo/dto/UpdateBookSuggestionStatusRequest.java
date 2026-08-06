package com.example.demo.dto;

import com.example.demo.model.BookRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookSuggestionStatusRequest {
    @NotNull(message = "Status is required")
    private BookRequestStatus status;
    private String adminComment;
}

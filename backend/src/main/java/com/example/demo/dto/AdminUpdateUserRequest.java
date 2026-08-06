package com.example.demo.dto;

import com.example.demo.model.UserStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String studentIdNumber;
    private Integer maxBorrowLimit;
    private UserStatus status;
}

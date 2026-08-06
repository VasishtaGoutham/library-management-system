package com.example.demo.controller;

import com.example.demo.dto.AdminUpdateUserRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.model.User;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getProfile(userDetails.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.updateProfile(userDetails.getId(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<AuthResponse> changeMyPassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.changePassword(userDetails.getId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> adminUpdateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.adminUpdateUser(id, request));
    }
}

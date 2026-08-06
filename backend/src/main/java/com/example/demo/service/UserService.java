package com.example.demo.service;

import com.example.demo.dto.AdminUpdateUserRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentIdNumber(user.getStudentIdNumber())
                .role(user.getRole().name())
                .message("Profile retrieved successfully")
                .build();
    }

    public AuthResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address is already in use!");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        if (request.getStudentIdNumber() != null && !request.getStudentIdNumber().trim().isEmpty()) {
            user.setStudentIdNumber(request.getStudentIdNumber().trim());
        }

        userRepository.save(user);

        String newToken = jwtUtils.generateTokenFromUsername(user.getEmail());

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentIdNumber(user.getStudentIdNumber())
                .role(user.getRole().name())
                .token(newToken)
                .message("Profile updated successfully!")
                .build();
    }

    public AuthResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .studentIdNumber(user.getStudentIdNumber())
                .role(user.getRole().name())
                .message("Password changed successfully!")
                .build();
    }

    public User adminUpdateUser(Long studentId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        user.setFullName(request.getFullName());
        if (request.getStudentIdNumber() != null && !request.getStudentIdNumber().trim().isEmpty()) {
            user.setStudentIdNumber(request.getStudentIdNumber().trim());
        }
        if (request.getMaxBorrowLimit() != null && request.getMaxBorrowLimit() > 0) {
            user.setMaxBorrowLimit(request.getMaxBorrowLimit());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        return userRepository.save(user);
    }
}

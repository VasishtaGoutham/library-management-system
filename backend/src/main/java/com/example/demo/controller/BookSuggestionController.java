package com.example.demo.controller;

import com.example.demo.dto.BookSuggestionResponse;
import com.example.demo.dto.CreateBookSuggestionRequest;
import com.example.demo.dto.UpdateBookSuggestionStatusRequest;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.BookSuggestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/book-suggestions")
@RequiredArgsConstructor
public class BookSuggestionController {

    private final BookSuggestionService suggestionService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookSuggestionResponse> createSuggestion(
            @Valid @RequestBody CreateBookSuggestionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(suggestionService.createSuggestion(request, userDetails.getId()));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookSuggestionResponse>> getMySuggestions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(suggestionService.getMySuggestions(userDetails.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookSuggestionResponse>> getAllSuggestions() {
        return ResponseEntity.ok(suggestionService.getAllSuggestions());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookSuggestionResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookSuggestionStatusRequest request
    ) {
        return ResponseEntity.ok(suggestionService.updateStatus(id, request));
    }
}

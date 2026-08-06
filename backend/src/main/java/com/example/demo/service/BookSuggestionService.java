package com.example.demo.service;

import com.example.demo.dto.BookSuggestionResponse;
import com.example.demo.dto.CreateBookSuggestionRequest;
import com.example.demo.dto.UpdateBookSuggestionStatusRequest;
import com.example.demo.model.BookRequestStatus;
import com.example.demo.model.BookSuggestion;
import com.example.demo.model.User;
import com.example.demo.repository.BookSuggestionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookSuggestionService {

    private final BookSuggestionRepository suggestionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public BookSuggestionResponse createSuggestion(CreateBookSuggestionRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        BookSuggestion suggestion = BookSuggestion.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .reason(request.getReason())
                .student(student)
                .status(BookRequestStatus.PENDING)
                .build();

        BookSuggestion saved = suggestionRepository.save(suggestion);
        return convertToResponse(saved);
    }

    public List<BookSuggestionResponse> getMySuggestions(Long studentId) {
        return suggestionRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookSuggestionResponse> getAllSuggestions() {
        return suggestionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookSuggestionResponse updateStatus(Long suggestionId, UpdateBookSuggestionStatusRequest request) {
        BookSuggestion suggestion = suggestionRepository.findById(suggestionId)
                .orElseThrow(() -> new RuntimeException("Book suggestion not found"));

        suggestion.setStatus(request.getStatus());
        if (request.getAdminComment() != null) {
            suggestion.setAdminComment(request.getAdminComment());
        }

        BookSuggestion updated = suggestionRepository.save(suggestion);

        // Send email alert to student
        try {
            emailService.sendSuggestionStatusNotification(
                    updated.getStudent().getEmail(),
                    updated.getStudent().getFullName(),
                    updated.getTitle(),
                    updated.getStatus().name(),
                    updated.getAdminComment()
            );
        } catch (Exception e) {
            // ignore email notification glitches
        }

        return convertToResponse(updated);
    }

    private BookSuggestionResponse convertToResponse(BookSuggestion s) {
        return BookSuggestionResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .author(s.getAuthor())
                .isbn(s.getIsbn())
                .reason(s.getReason())
                .studentId(s.getStudent().getId())
                .studentName(s.getStudent().getFullName())
                .studentEmail(s.getStudent().getEmail())
                .status(s.getStatus())
                .adminComment(s.getAdminComment())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}

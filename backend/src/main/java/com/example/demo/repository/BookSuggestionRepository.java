package com.example.demo.repository;

import com.example.demo.model.BookSuggestion;
import com.example.demo.model.BookRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookSuggestionRepository extends JpaRepository<BookSuggestion, Long> {
    List<BookSuggestion> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<BookSuggestion> findAllByOrderByCreatedAtDesc();
    long countByStatus(BookRequestStatus status);
}

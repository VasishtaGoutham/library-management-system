package com.example.demo.repository;

import com.example.demo.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByIsDeletedFalse();
    Optional<Book> findByIdAndIsDeletedFalse(Long id);
    Optional<Book> findByIsbnAndIsDeletedFalse(String isbn);
    Boolean existsByIsbnAndIsDeletedFalse(String isbn);

    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN b.copies c WHERE b.isDeleted = false AND " +
           "(:categoryId IS NULL OR b.category.id = :categoryId) AND " +
           "(:query IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.barcode) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Book> searchBooks(@Param("query") String query, @Param("categoryId") Long categoryId, Pageable pageable);
}

package com.example.demo.repository;

import com.example.demo.model.BookCopy;
import com.example.demo.model.CopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    Optional<BookCopy> findByBarcode(String barcode);
    List<BookCopy> findByBookId(Long bookId);
    List<BookCopy> findByBookIdAndStatus(Long bookId, CopyStatus status);
    Long countByBookIdAndStatus(Long bookId, CopyStatus status);
    Long countByBookId(Long bookId);
    Long countByStatus(CopyStatus status);
    boolean existsByBarcode(String barcode);
}

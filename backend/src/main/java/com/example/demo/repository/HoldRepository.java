package com.example.demo.repository;

import com.example.demo.model.HoldRequest;
import com.example.demo.model.HoldStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoldRepository extends JpaRepository<HoldRequest, Long> {
    List<HoldRequest> findByBookIdAndStatusOrderByRequestDateAsc(Long bookId, HoldStatus status);

    List<HoldRequest> findByStudentIdOrderByRequestDateDesc(Long studentId);
    List<HoldRequest> findAllByOrderByRequestDateDesc();

    boolean existsByBookIdAndStudentIdAndStatus(Long bookId, Long studentId, HoldStatus status);

    long countByBookIdAndStatus(Long bookId, HoldStatus status);

    Optional<HoldRequest> findFirstByBookIdAndStatusOrderByRequestDateAsc(Long bookId, HoldStatus status);
}

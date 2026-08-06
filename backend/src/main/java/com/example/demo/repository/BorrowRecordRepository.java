package com.example.demo.repository;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByStudentId(Long studentId);
    List<BorrowRecord> findByStudentIdAndStatus(Long studentId, BorrowStatus status);
    Long countByStudentIdAndStatus(Long studentId, BorrowStatus status);
    
    Optional<BorrowRecord> findByCopyIdAndStatus(Long copyId, BorrowStatus status);
    List<BorrowRecord> findByStatus(BorrowStatus status);

    @Query("SELECT b FROM BorrowRecord b WHERE b.status = 'ISSUED' AND b.dueDate < :now")
    List<BorrowRecord> findOverdueRecords(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(b) FROM BorrowRecord b WHERE b.status = 'ISSUED'")
    Long countTotalIssued();

    @Query("SELECT COUNT(b) FROM BorrowRecord b WHERE b.status = 'OVERDUE' OR (b.status = 'ISSUED' AND b.dueDate < CURRENT_TIMESTAMP)")
    Long countTotalOverdue();
}

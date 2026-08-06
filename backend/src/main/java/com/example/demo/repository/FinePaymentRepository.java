package com.example.demo.repository;

import com.example.demo.model.FinePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FinePaymentRepository extends JpaRepository<FinePayment, Long> {
    List<FinePayment> findByBorrowRecordId(Long borrowRecordId);

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM FinePayment p")
    BigDecimal sumTotalFinesCollected();
}

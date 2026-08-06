package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fine_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_record_id", nullable = false)
    private BorrowRecord borrowRecord;

    @Column(nullable = false)
    private BigDecimal amountPaid;

    private String paymentMethod;

    private String transactionRef;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime paidAt = LocalDateTime.now();
}

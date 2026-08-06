package com.example.demo.service;

import com.example.demo.dto.DashboardSummaryDto;
import com.example.demo.model.CopyStatus;
import com.example.demo.model.Role;
import com.example.demo.repository.BookCopyRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final FinePaymentRepository finePaymentRepository;

    public DashboardSummaryDto getSummary() {
        Long totalBooks = bookRepository.count();
        Long totalCopies = bookCopyRepository.count();
        Long availableCopies = bookCopyRepository.countByStatus(CopyStatus.AVAILABLE);
        Long totalIssued = borrowRecordRepository.countTotalIssued();
        Long totalOverdue = borrowRecordRepository.countTotalOverdue();
        Long totalStudents = (long) userRepository.findByRole(Role.ROLE_STUDENT).size();
        BigDecimal totalFinesCollected = finePaymentRepository.sumTotalFinesCollected();

        return DashboardSummaryDto.builder()
                .totalBooks(totalBooks)
                .totalCopies(totalCopies)
                .availableCopies(availableCopies)
                .totalIssued(totalIssued)
                .totalOverdue(totalOverdue)
                .totalStudents(totalStudents)
                .totalFinesCollected(totalFinesCollected)
                .build();
    }
}

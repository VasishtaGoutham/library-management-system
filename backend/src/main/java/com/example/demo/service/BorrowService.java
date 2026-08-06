package com.example.demo.service;

import com.example.demo.dto.BorrowRequest;
import com.example.demo.dto.ReturnRequest;
import com.example.demo.model.*;
import com.example.demo.repository.BookCopyRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;
    private final FinePaymentRepository finePaymentRepository;
    private final EmailService emailService;
    private final HoldService holdService;

    private static final int DEFAULT_BORROW_DAYS = 14;
    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("1.00");
    private static final BigDecimal MAX_FINE_CAP = new BigDecimal("50.00");

    @Transactional
    public BorrowRecord issueBook(BorrowRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + request.getStudentId()));

        if (student.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("Student account is suspended!");
        }

        Long activeCount = borrowRecordRepository.countByStudentIdAndStatus(student.getId(), BorrowStatus.ISSUED);
        if (activeCount >= student.getMaxBorrowLimit()) {
            throw new RuntimeException("Student has reached the maximum borrowing limit of " + student.getMaxBorrowLimit() + " books.");
        }

        BookCopy copy = bookCopyRepository.findByBarcode(request.getBarcode())
                .orElseThrow(() -> new RuntimeException("Book copy not found with barcode: " + request.getBarcode()));

        if (copy.getStatus() != CopyStatus.AVAILABLE) {
            throw new RuntimeException("Book copy is not available. Current status: " + copy.getStatus());
        }

        int days = (request.getBorrowDays() != null && request.getBorrowDays() >= 1 && request.getBorrowDays() <= 14)
                ? request.getBorrowDays()
                : DEFAULT_BORROW_DAYS;

        copy.setStatus(CopyStatus.BORROWED);
        bookCopyRepository.save(copy);

        LocalDateTime now = LocalDateTime.now();
        BorrowRecord record = BorrowRecord.builder()
                .copy(copy)
                .student(student)
                .issueDate(now)
                .dueDate(now.plusDays(days))
                .status(BorrowStatus.ISSUED)
                .fineAmount(BigDecimal.ZERO)
                .fineStatus(FineStatus.NONE)
                .build();

        BorrowRecord savedRecord = borrowRecordRepository.save(record);
        emailService.sendIssueNotification(savedRecord);
        return savedRecord;
    }

    @Transactional
    public BorrowRecord returnBook(ReturnRequest request) {
        BookCopy copy = bookCopyRepository.findByBarcode(request.getBarcode())
                .orElseThrow(() -> new RuntimeException("Book copy not found with barcode: " + request.getBarcode()));

        BorrowRecord record = borrowRecordRepository.findByCopyIdAndStatus(copy.getId(), BorrowStatus.ISSUED)
                .or(() -> borrowRecordRepository.findByCopyIdAndStatus(copy.getId(), BorrowStatus.OVERDUE))
                .orElseThrow(() -> new RuntimeException("No active borrow record found for barcode: " + request.getBarcode()));

        LocalDateTime now = LocalDateTime.now();
        record.setReturnDate(now);
        record.setStatus(BorrowStatus.RETURNED);

        if (now.isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), now);
            if (daysOverdue > 0) {
                BigDecimal fine = DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue));
                if (fine.compareTo(MAX_FINE_CAP) > 0) {
                    fine = MAX_FINE_CAP;
                }
                record.setFineAmount(fine);
                record.setFineStatus(FineStatus.UNPAID);
            }
        }

        copy.setStatus(CopyStatus.AVAILABLE);
        bookCopyRepository.save(copy);

        BorrowRecord savedRecord = borrowRecordRepository.save(record);
        emailService.sendReturnNotification(savedRecord);
        try {
            holdService.processNextHoldIfAvailable(copy.getBook().getId());
        } catch (Exception e) {
            // ignore hold notify glitch
        }
        return savedRecord;
    }

    @Transactional
    public FinePayment payFine(Long borrowRecordId, BigDecimal amountPaid, String paymentMethod, String transactionRef) {
        BorrowRecord record = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found with id: " + borrowRecordId));

        if (record.getFineStatus() == FineStatus.NONE || record.getFineAmount().compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("No fine due for this borrowing record.");
        }

        FinePayment payment = FinePayment.builder()
                .borrowRecord(record)
                .amountPaid(amountPaid)
                .paymentMethod(paymentMethod != null ? paymentMethod : "CASH")
                .transactionRef(transactionRef != null ? transactionRef : "REF-" + System.currentTimeMillis())
                .paidAt(LocalDateTime.now())
                .build();

        record.setFineStatus(FineStatus.PAID);
        borrowRecordRepository.save(record);

        return finePaymentRepository.save(payment);
    }

    public List<BorrowRecord> getStudentBorrowings(Long studentId) {
        return borrowRecordRepository.findByStudentId(studentId);
    }

    public List<BorrowRecord> getAllBorrowings() {
        return borrowRecordRepository.findAll();
    }
}

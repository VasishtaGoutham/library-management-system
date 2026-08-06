package com.example.demo.scheduler;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowStatus;
import com.example.demo.model.FineStatus;
import com.example.demo.repository.BorrowRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
public class FineCalculatorScheduler {

    private final BorrowRecordRepository borrowRecordRepository;

    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("1.00");
    private static final BigDecimal MAX_FINE_CAP = new BigDecimal("50.00");

    // Runs every day at midnight (00:00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateOverdueFines() {
        LocalDateTime now = LocalDateTime.now();
        List<BorrowRecord> overdueRecords = borrowRecordRepository.findOverdueRecords(now);

        for (BorrowRecord record : overdueRecords) {
            record.setStatus(BorrowStatus.OVERDUE);
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), now);
            if (daysOverdue > 0) {
                BigDecimal fine = DAILY_FINE_RATE.multiply(BigDecimal.valueOf(daysOverdue));
                if (fine.compareTo(MAX_FINE_CAP) > 0) {
                    fine = MAX_FINE_CAP;
                }
                record.setFineAmount(fine);
                if (record.getFineStatus() == FineStatus.NONE) {
                    record.setFineStatus(FineStatus.UNPAID);
                }
            }
            borrowRecordRepository.save(record);
        }
        System.out.println(">>> [Cron Scheduler] Processed " + overdueRecords.size() + " overdue borrow records.");
    }
}

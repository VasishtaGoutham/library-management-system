package com.example.demo.config;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowStatus;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final BorrowRecordRepository borrowRecordRepository;
    private final EmailService emailService;

    // Daily Cron Job at 09:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    @EventListener(ApplicationReadyEvent.class)
    public void checkAndSendDueDateReminders() {
        log.info(">>> Running Daily Automated Due-Date Reminder Scheduler...");
        List<BorrowRecord> activeRecords = borrowRecordRepository.findAll().stream()
                .filter(r -> r.getStatus() == BorrowStatus.ISSUED || r.getStatus() == BorrowStatus.OVERDUE)
                .toList();

        LocalDateTime now = LocalDateTime.now();
        int countSent = 0;

        for (BorrowRecord record : activeRecords) {
            long daysRemaining = ChronoUnit.DAYS.between(now.toLocalDate(), record.getDueDate().toLocalDate());
            if (daysRemaining <= 2) {
                emailService.sendDueDateReminder(record, (int) daysRemaining);
                countSent++;
            }
        }

        log.info(">>> Daily Due-Date Reminder Scheduler Finished. Sent {} notifications.", countSent);
    }
}

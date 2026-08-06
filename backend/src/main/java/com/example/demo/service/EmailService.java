package com.example.demo.service;

import com.example.demo.model.BorrowRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class EmailService {

    @Value("${app.resend.api-key:re_demo_key_placeholder}")
    private String resendApiKey;

    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final String RESEND_OWNER_EMAIL = "vasishtagouthamkrishna@gmail.com";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public void sendIssueNotification(BorrowRecord record) {
        String studentEmail = record.getStudent().getEmail();
        String studentName = record.getStudent().getFullName();
        String bookTitle = record.getCopy().getBook().getTitle();
        String barcode = record.getCopy().getBarcode();
        String dueDateStr = record.getDueDate().format(DATE_FORMATTER);

        String subject = "📚 Book Check-Out Confirmation: " + bookTitle;
        String htmlContent = String.format(
            "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;'>" +
            "<h2 style='color: #6366f1;'>📚 Library Universe — Check-Out Receipt</h2>" +
            "<p>Hello <b>%s</b>,</p>" +
            "<p>You have successfully checked out <b>%s</b> (Barcode: <code>%s</code>).</p>" +
            "<p style='background-color: #1e293b; padding: 12px; border-left: 4px solid #10b981; border-radius: 6px;'>" +
            "📅 <b>Due Date:</b> %s<br/>" +
            "⚠️ <i>Please return on or before the due date to avoid overdue fines ($1.00/day).</i>" +
            "</p>" +
            "<p style='color: #94a3b8; font-size: 12px; margin-top: 20px;'>Library Management System © 2026</p>" +
            "</div>",
            studentName, bookTitle, barcode, dueDateStr
        );

        sendResendEmail(studentEmail, subject, htmlContent);
    }

    public void sendReturnNotification(BorrowRecord record) {
        String studentEmail = record.getStudent().getEmail();
        String studentName = record.getStudent().getFullName();
        String bookTitle = record.getCopy().getBook().getTitle();
        String barcode = record.getCopy().getBarcode();
        double fine = record.getFineAmount() != null ? record.getFineAmount().doubleValue() : 0.0;

        String subject = "✅ Book Return Confirmation: " + bookTitle;
        String fineInfo = fine > 0 ? String.format("Assessed Overdue Fine: <b style='color: #f43f5e;'>$%.2f</b>", fine) : "<b style='color: #34d399;'>$0.00 (No Fines)</b>";
        String htmlContent = String.format(
            "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;'>" +
            "<h2 style='color: #10b981;'>✅ Library Universe — Return Receipt</h2>" +
            "<p>Hello <b>%s</b>,</p>" +
            "<p>Thank you for returning <b>%s</b> (Barcode: <code>%s</code>).</p>" +
            "<p style='background-color: #1e293b; padding: 12px; border-left: 4px solid #6366f1; border-radius: 6px;'>" +
            "💰 <b>Fine Assessment:</b> %s" +
            "</p>" +
            "<p style='color: #94a3b8; font-size: 12px; margin-top: 20px;'>Library Management System © 2026</p>" +
            "</div>",
            studentName, bookTitle, barcode, fineInfo
        );

        sendResendEmail(studentEmail, subject, htmlContent);
    }

    public void sendDueDateReminder(BorrowRecord record, int daysRemaining) {
        String studentEmail = record.getStudent().getEmail();
        String studentName = record.getStudent().getFullName();
        String bookTitle = record.getCopy().getBook().getTitle();
        String barcode = record.getCopy().getBarcode();
        String dueDateStr = record.getDueDate().format(DATE_FORMATTER);

        String subject = daysRemaining <= 0 
            ? "⚠️ URGENT: Book Overdue Notice - " + bookTitle
            : "⏰ Reminder: Book Due in " + daysRemaining + " Days - " + bookTitle;

        String alertColor = daysRemaining <= 0 ? "#f43f5e" : "#f59e0b";
        String bodyNotice = daysRemaining <= 0
            ? String.format("Your borrowed book <b>%s</b> (Barcode: <code>%s</code>) was due on <b>%s</b> and is now <b>OVERDUE</b>.<br/>Please return it immediately to limit overdue fines ($1.00/day).", bookTitle, barcode, dueDateStr)
            : String.format("This is a friendly reminder that <b>%s</b> (Barcode: <code>%s</code>) is due on <b>%s</b> (<b>%d days remaining</b>).", bookTitle, barcode, dueDateStr, daysRemaining);

        String htmlContent = String.format(
            "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;'>" +
            "<h2 style='color: %s;'>%s</h2>" +
            "<p>Hello <b>%s</b>,</p>" +
            "<p style='background-color: #1e293b; padding: 14px; border-left: 4px solid %s; border-radius: 6px; line-height: 1.6;'>" +
            "%s" +
            "</p>" +
            "<p style='color: #94a3b8; font-size: 12px; margin-top: 20px;'>Library Management System © 2026</p>" +
            "</div>",
            alertColor, subject, studentName, alertColor, bodyNotice
        );

        sendResendEmail(studentEmail, subject, htmlContent);
    }

    private void sendResendEmail(String toEmail, String subject, String htmlBody) {
        String targetRecipient = RESEND_OWNER_EMAIL;

        log.info("\n=== 🚀 DISPATCHING RESEND API EMAIL ===");
        log.info("To: {}", targetRecipient);
        log.info("Subject: {}", subject);

        try {
            String jsonPayload = String.format(
                "{\"from\":\"Library Universe <onboarding@resend.dev>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\"}",
                targetRecipient, escapeJson(subject), escapeJson(htmlBody)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                log.info(">>> 🎉 SUCCESS! RESEND API DELIVERED LIVE EMAIL TO {}. Response: {}", targetRecipient, response.body());
            } else {
                log.warn(">>> Resend API Warning (Code {}): {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error(">>> Error delivering Resend email: {}", e.getMessage(), e);
        }
        log.info("=========================================\n");
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        return raw.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\b", "\\b")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}

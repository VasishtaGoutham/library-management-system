package com.example.demo.controller;

import com.example.demo.model.BorrowRecord;
import com.example.demo.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final BorrowService borrowService;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @GetMapping("/circulation/csv")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportCirculationCsv() {
        List<BorrowRecord> records = borrowService.getAllBorrowings();
        StringBuilder csv = new StringBuilder();
        csv.append("Borrow ID,Student Name,Student Email,Book Title,Barcode,Issue Date,Due Date,Return Date,Status,Fine Amount,Fine Status\n");

        for (BorrowRecord r : records) {
            csv.append(r.getId()).append(",")
               .append("\"").append(r.getStudent().getFullName().replace("\"", "\"\"")).append("\",")
               .append(r.getStudent().getEmail()).append(",")
               .append("\"").append(r.getCopy().getBook().getTitle().replace("\"", "\"\"")).append("\",")
               .append(r.getCopy().getBarcode()).append(",")
               .append(r.getIssueDate() != null ? r.getIssueDate().format(FMT) : "").append(",")
               .append(r.getDueDate() != null ? r.getDueDate().format(FMT) : "").append(",")
               .append(r.getReturnDate() != null ? r.getReturnDate().format(FMT) : "").append(",")
               .append(r.getStatus()).append(",")
               .append(r.getFineAmount()).append(",")
               .append(r.getFineStatus()).append("\n");
        }

        byte[] body = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=circulation_history_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }

    @GetMapping("/circulation/html")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> exportCirculationHtmlReport() {
        List<BorrowRecord> records = borrowService.getAllBorrowings();
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><title>Library Universe - Official Circulation & Fine Report</title>")
            .append("<style>")
            .append("body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #0f172a; color: #f8fafc; }")
            .append("h1 { color: #6366f1; border-bottom: 2px solid #334155; padding-bottom: 10px; }")
            .append("table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }")
            .append("th, td { padding: 10px; border: 1px solid #334155; text-align: left; }")
            .append("th { background-color: #1e293b; color: #818cf8; uppercase; }")
            .append("tr:nth-child(even) { background-color: #1e293b; }")
            .append(".badge { padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; }")
            .append(".ISSUED { background: #065f46; color: #34d399; }")
            .append(".OVERDUE { background: #78350f; color: #fbbf24; }")
            .append(".RETURNED { background: #334155; color: #94a3b8; }")
            .append("</style></head><body>")
            .append("<h1>📚 Library Universe — Official Circulation & Fine Report</h1>")
            .append("<p style='color: #94a3b8;'>Generated on ").append(java.time.LocalDateTime.now().format(FMT)).append(" | Total Records: ").append(records.size()).append("</p>")
            .append("<table><thead><tr><th>ID</th><th>Student</th><th>Book Title</th><th>Barcode</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead><tbody>");

        for (BorrowRecord r : records) {
            html.append("<tr>")
                .append("<td>#").append(r.getId()).append("</td>")
                .append("<td><b>").append(r.getStudent().getFullName()).append("</b><br/><small style='color:#94a3b8;'>").append(r.getStudent().getEmail()).append("</small></td>")
                .append("<td>").append(r.getCopy().getBook().getTitle()).append("</td>")
                .append("<td><code>").append(r.getCopy().getBarcode()).append("</code></td>")
                .append("<td>").append(r.getIssueDate().format(FMT)).append("</td>")
                .append("<td><b>").append(r.getDueDate().format(FMT)).append("</b></td>")
                .append("<td><span class='badge ").append(r.getStatus()).append("'>").append(r.getStatus()).append("</span></td>")
                .append("<td>").append(r.getFineAmount().compareTo(java.math.BigDecimal.ZERO) > 0 ? "<span style='color:#f43f5e;'>$" + String.format("%.2f", r.getFineAmount()) + "</span>" : "$0.00").append("</td>")
                .append("</tr>");
        }

        html.append("</tbody></table></body></html>");

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html.toString());
    }
}

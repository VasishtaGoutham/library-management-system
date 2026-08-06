package com.example.demo.controller;

import com.example.demo.dto.BorrowRequest;
import com.example.demo.dto.ReturnRequest;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.FinePayment;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/borrowings")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BorrowRecord> issueBook(@Valid @RequestBody BorrowRequest request) {
        return ResponseEntity.ok(borrowService.issueBook(request));
    }

    @PutMapping("/return")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BorrowRecord> returnBook(@Valid @RequestBody ReturnRequest request) {
        return ResponseEntity.ok(borrowService.returnBook(request));
    }

    @PostMapping("/{id}/pay-fine")
    public ResponseEntity<FinePayment> payFine(
            @PathVariable Long id,
            @RequestParam BigDecimal amountPaid,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) String transactionRef
    ) {
        return ResponseEntity.ok(borrowService.payFine(id, amountPaid, paymentMethod, transactionRef));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BorrowRecord>> getMyBorrowings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(borrowService.getStudentBorrowings(userDetails.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BorrowRecord>> getAllBorrowings() {
        return ResponseEntity.ok(borrowService.getAllBorrowings());
    }
}

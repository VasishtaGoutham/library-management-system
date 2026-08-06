package com.example.demo.controller;

import com.example.demo.dto.HoldResponse;
import com.example.demo.security.UserDetailsImpl;
import com.example.demo.service.HoldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/holds")
@RequiredArgsConstructor
public class HoldController {

    private final HoldService holdService;

    @PostMapping("/{bookId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HoldResponse> requestHold(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(holdService.requestHold(bookId, userDetails.getId()));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HoldResponse>> getMyHolds(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(holdService.getMyHolds(userDetails.getId()));
    }

    @DeleteMapping("/{holdId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelHold(
            @PathVariable Long holdId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        holdService.cancelHold(holdId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}

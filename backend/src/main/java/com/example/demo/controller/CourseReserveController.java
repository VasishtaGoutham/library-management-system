package com.example.demo.controller;

import com.example.demo.dto.CourseReserveResponse;
import com.example.demo.dto.CreateCourseReserveRequest;
import com.example.demo.service.CourseReserveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/course-reserves")
@RequiredArgsConstructor
public class CourseReserveController {

    private final CourseReserveService courseReserveService;

    @GetMapping
    public ResponseEntity<List<CourseReserveResponse>> getAllReserves() {
        return ResponseEntity.ok(courseReserveService.getAllReserves());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseReserveResponse> createReserve(@Valid @RequestBody CreateCourseReserveRequest request) {
        return ResponseEntity.ok(courseReserveService.createReserve(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReserve(@PathVariable Long id) {
        courseReserveService.deleteReserve(id);
        return ResponseEntity.noContent().build();
    }
}

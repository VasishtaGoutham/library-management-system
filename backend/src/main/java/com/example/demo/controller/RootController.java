package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getRootStatus() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "Library Universe Backend API Service is active!",
            "version", "1.0.0"
        ));
    }
}

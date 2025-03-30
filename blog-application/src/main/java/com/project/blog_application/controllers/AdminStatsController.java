package com.project.blog_application.controllers;

import com.project.blog_application.services.AdminStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    public AdminStatsController(AdminStatsService adminStatsService) {
        this.adminStatsService = adminStatsService;
    }

    @GetMapping("/users/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getUserCount() {
        long count = adminStatsService.getUserCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/posts/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getPostCount() {
        long count = adminStatsService.getPostCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/comments/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getCommentCount() {
        long count = adminStatsService.getCommentCount();
        return ResponseEntity.ok(count);
    }
}
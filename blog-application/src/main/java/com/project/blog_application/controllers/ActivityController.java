// filepath: /Users/sahilarora/Projects/Sprig Boot Projects/blog-application/src/main/java/com/project/blog_application/controllers/ActivityController.java
package com.project.blog_application.controllers;

import com.project.blog_application.DTO.RecentActivityDTO;
import com.project.blog_application.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/recent")
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities() {
        List<RecentActivityDTO> recentActivities = activityService.getRecentActivities();
        return ResponseEntity.ok(recentActivities);
    }
}
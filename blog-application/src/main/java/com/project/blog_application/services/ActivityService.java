// filepath: /Users/sahilarora/Projects/Sprig Boot Projects/blog-application/src/main/java/com/project/blog_application/services/ActivityService.java
package com.project.blog_application.services;

import com.project.blog_application.DTO.RecentActivityDTO;
import com.project.blog_application.entities.BlogPost;
import com.project.blog_application.entities.Comment;
import com.project.blog_application.entities.User;
import com.project.blog_application.repository.BlogPostRepository;
import com.project.blog_application.repository.CommentRepository;
import com.project.blog_application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RecentActivityDTO> getRecentActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();

        List<BlogPost> recentBlogPosts = blogPostRepository.findTop10ByOrderByCreatedAtDesc();
        activities.addAll(recentBlogPosts.stream()
                .map(post -> new RecentActivityDTO("BlogPost", "New post: " + post.getTitle(), post.getCreatedAt()))
                .collect(Collectors.toList()));

        List<Comment> recentComments = commentRepository.findTop10ByOrderByCreatedAtDesc();
        activities.addAll(recentComments.stream()
                .map(comment -> new RecentActivityDTO("Comment", "New comment by " + comment.getUser().getUsername(), comment.getCreatedAt()))
                .collect(Collectors.toList()));

        List<User> recentUsers = userRepository.findTop10ByOrderByCreatedAtDesc();
        activities.addAll(recentUsers.stream()
                .map(user -> new RecentActivityDTO("User", "New user: " + user.getUsername(), user.getCreatedAt()))
                .collect(Collectors.toList()));

        // Sort activities by timestamp
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

        return activities;
    }
}
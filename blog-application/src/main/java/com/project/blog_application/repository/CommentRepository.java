package com.project.blog_application.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import com.project.blog_application.entities.Comment;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find comments by blog post id
    List<Comment> findByBlogPostId(Long blogPostId);

    // Find comments by user id
    List<Comment> findByUserId(Long userId);

    // Find comments by blog post id and user id
    List<Comment> findByBlogPostIdAndUserId(Long blogPostId, Long userId);

    @Query("SELECT c FROM Comment c JOIN FETCH c.blogPost JOIN FETCH c.user")
    @NonNull
    List<Comment> findAll(); 

    // Find top 10 comments by creation date
    List<Comment> findTop10ByOrderByCreatedAtDesc();
    
}

package com.project.blog_application.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.blog_application.entities.BlogPost;
import com.project.blog_application.entities.Like;
import com.project.blog_application.entities.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    // Find all likes for a specific blog post
    List<Like> findByBlogPostId(Long blogPostId);

    // Count the no of likes for a specific blog post
    Long countByBlogPostId(Long blogPostid);

    // Find all likes by a specific user
    List<Like> findByUserId(Long userId);

    /**
    * Check if a user has liked a specific post
    */
    boolean existsByBlogPostIdAndUserId(Long blogPostId, Long userId);

    // Delete a like by user and blog post
    void deleteByBlogPostIdAndUserId(Long blogPostId, Long userId);

    // Find blog posts liked by a specific user
    @Query("SELECT l.blogPost FROM Like l WHERE l.user.id = :userId")
    List<BlogPost> findBlogPostsLikedByUser(@Param("userId") Long userId);

    // Get Users who liked a specific blog post
    @Query("SELECT L.user FROM Like L WHERE L.blogPost.id = :blogPostId")
    List<User> findUsersByBlogPostId(@Param("blogPostId") Long blogPostId);
}

package com.project.blog_application.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.blog_application.entities.BlogPost;
import com.project.blog_application.entities.Like;
import com.project.blog_application.entities.User;
import com.project.blog_application.repository.BlogPostRepository;
import com.project.blog_application.repository.LikeRepository;
import com.project.blog_application.repository.UserRepository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {
    
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final BlogPostRepository blogPostRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository, UserRepository userRepository,
            BlogPostRepository blogPostRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.blogPostRepository = blogPostRepository;
    }

    /**
     * Toggles like status for a specific user.
     * If the user has already liked the post, it will unlike it.
     * If the user hasn't liked the post yet, it will add a new like.
     * 
     * @param userId The ID of the user liking/unliking the post
     * @param blogPostId The ID of the blog post to like/unlike
     * @return A message indicating the result of the operation
     */
    @Transactional
    public String toggleLike(Long userId, Long blogPostId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<BlogPost> blogPostOptional = blogPostRepository.findById(blogPostId);
        
        if (userOptional.isPresent() && blogPostOptional.isPresent()) {
            User user = userOptional.get();
            BlogPost blogPost = blogPostOptional.get();
            
            // Check if the user already liked this post
            boolean hasLiked = likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId);
            
            if (hasLiked) {
                // User already liked the post, so unlike it
                likeRepository.deleteByBlogPostIdAndUserId(blogPostId, userId);
                return "Post unliked successfully.";
            } else {
                // User hasn't liked the post yet, so add a new like
                Like like = new Like();
                like.setUser(user);
                like.setBlogPost(blogPost);
                likeRepository.save(like);
                return "Post liked successfully.";
            }
        }
        
        throw new RuntimeException("User or BlogPost not found for userId=" + userId + ", blogPostId=" + blogPostId);
    }
    
    /**
     * Get the number of likes for a blog post.
     */
    public Long getLikeCount(Long blogPostId) {
        return likeRepository.countByBlogPostId(blogPostId);
    }
    
    /**
     * Check if a specific user has liked a blog post.
     * 
     * @param userId The ID of the user
     * @param blogPostId The ID of the blog post
     * @return true if the user has liked the post, false otherwise
     */
    public boolean hasUserLiked(Long userId, Long blogPostId) {
        return likeRepository.existsByBlogPostIdAndUserId(blogPostId, userId);
    }
    
    /**
     * Get all blog posts liked by a specific user.
     * 
     * @param userId The ID of the user
     * @return List of blog posts liked by the user
     */
    public List<BlogPost> getLikedBlogPosts(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            return likeRepository.findBlogPostsLikedByUser(userId);
        }
        
        throw new RuntimeException("User not found for userId=" + userId);
    }
}
package com.project.blog_application.entities;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "likes")  // This will map to the "likes" table in your database
public class Like {
    
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "user_id", nullable = false)  // Specifies the foreign key column (user_id); cannot be null
    private User user;  // The user who liked the blog post

    @ManyToOne(fetch = FetchType.LAZY)    
    @JoinColumn(name = "blog_post_id", nullable = false)  
    private BlogPost blogPost;  

    public Like() {}

    public Like(User user, BlogPost blogPost, LocalDateTime likedAt) {
        this.user = user;
        this.blogPost = blogPost;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BlogPost getPost() {
        return blogPost;
    }

    public void setPost(BlogPost post) {
        this.blogPost = post;
    }

}

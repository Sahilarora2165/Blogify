package com.project.blog_application.entities;

import java.time.LocalDateTime;

import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "likes" , uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "blog_post_id"})
})
@Data // Automatically generates getters, setters, equals, hashCode, and toString methods
@AllArgsConstructor
@NoArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_post_id", nullable = false)
    private BlogPost blogPost;

    @Column(name = "created_at" , nullable = false, updatable = false) 
    private LocalDateTime createdAt; // This is the timestamp when the like was created

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

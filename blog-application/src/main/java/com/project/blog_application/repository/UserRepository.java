package com.project.blog_application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.blog_application.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsername(@Param("username") String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by username or email (case insensitive)
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username) OR LOWER(u.email) = LOWER(:email)")
    Optional<User> findByUsernameOrEmailIgnoreCase(@Param("username") String username, @Param("email") String email);

    // Check if user exists by username
    Boolean existsByUsername(String username);

    // Check if user exists by email (changed to Boolean for consistency)
    Boolean existsByEmail(String email);

    // Find top 10 users by creation date
    List<User> findTop10ByOrderByCreatedAtDesc();
}

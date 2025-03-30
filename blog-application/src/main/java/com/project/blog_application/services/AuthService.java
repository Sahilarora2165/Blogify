package com.project.blog_application.services;

import com.project.blog_application.DTO.LoginRequest;
import com.project.blog_application.DTO.LoginResponse;
import com.project.blog_application.entities.Role;
import com.project.blog_application.entities.User;
import com.project.blog_application.exceptions.InvalidCredentialsException;
import com.project.blog_application.exceptions.UserAlreadyExistsException;
import com.project.blog_application.repository.UserRepository;
import com.project.blog_application.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Constructor injection for dependencies
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Registers a new user with validation and default role
    public Map<String, String> register(User user) {
        logger.info("Registering user with email: {}", user.getEmail());

        if (user == null || user.getEmail() == null || user.getPassword() == null || user.getUsername() == null) {
            logger.error("Registration failed: User, email, username, or password is null");
            throw new IllegalArgumentException("User, email, username, and password are required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        logger.info("User registered successfully: {}", user.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return response;
    }

    // Authenticates user and generates JWT token
    public LoginResponse login(LoginRequest request) {
        logger.info("Login request received: {}", request);

        // Validate input
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            logger.error("Login failed: Request, email, or password is null");
            throw new InvalidCredentialsException("Email and password are required");
        }

        String email = request.getEmail();
        String password = request.getPassword();

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            logger.error("Login failed: User not found with email: {}", email);
            throw new InvalidCredentialsException("User not found");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.error("Login failed: Invalid password for email: {}", email);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Generate token with email and role
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        logger.info("Login successful for email: {}, role: {}", user.getEmail(), user.getRole().name());
        return new LoginResponse(token, "Login successful");
    }
}
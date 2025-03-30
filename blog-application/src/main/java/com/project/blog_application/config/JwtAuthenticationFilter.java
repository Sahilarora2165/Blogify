package com.project.blog_application.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.project.blog_application.security.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.lang.NonNull; // For nullability annotations

@Component // Registers this filter as a Spring-managed bean
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final UserDetailsService userDetailsService; // Service to load user details for authentication
    private final JwtUtil jwtUtil; // Utility for JWT token extraction and validation

    // Constructor injection for required dependencies
    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        logger.info("JwtAuthenticationFilter initialized, jwtUtil present: {}", jwtUtil != null);
    }

    // Filters incoming requests to validate JWT and set authentication
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain chain)
            throws ServletException, IOException {
        // Skip JWT validation for login and signup endpoints since they generate tokens
        String requestURI = request.getRequestURI();
        if (requestURI.equals("/api/auth/login") || requestURI.equals("/api/auth/signup") ||
                requestURI.equals("/api/users/login") || requestURI.equals("/api/users/register")) { // ✅ Skip Google login
            logger.debug("Skipping JWT filter for auth endpoint: {}", requestURI);
            chain.doFilter(request, response);
            return;
        }
        // Extract Authorization header from the request
        String header = request.getHeader("Authorization");
        logger.info("Received Authorization header: {}", header);

        // Check if header exists and is a Bearer token (case-insensitive)
        if (header != null && header.toLowerCase().startsWith("bearer ")) {
            String token = header.substring(7); // Extract token by removing "Bearer " prefix (case-insensitive)
            logger.info("Processing token: {}", token);

            try {
                // Extract email from token and validate it using JwtUtil
                String email = jwtUtil.extractEmail(token);
                if (email != null && jwtUtil.validateToken(token, email)) {
                    // Load user details by email (not username) to match JwtUtil's subject
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    logger.info("Authorities loaded for user {}: {}", email, userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.debug("Authentication set for user: {}", email);
                } else {
                    logger.error("Token validation failed: Invalid or expired token for email: {}", email);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                    return;
                }
            } catch (Exception e) {
                // Log token validation failures and clear context to prevent unauthorized
                // access
                logger.error("Token validation failed: {}", e.getMessage(), e); // Add stack trace for debugging
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return; // Stop the filter chain on failure
            }
        } else {
            logger.warn("No Authorization header or not a Bearer token for URI: {}", requestURI);
        }

        // Continue the filter chain regardless of authentication outcome
        chain.doFilter(request, response);
    }
}
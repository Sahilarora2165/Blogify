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
            @NonNull FilterChain chain) throws ServletException, IOException {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        logger.info("Request: {} {}", method, uri);

        String header = request.getHeader("Authorization");
        logger.info("Header: {}", header);

        if (header != null && header.toLowerCase().startsWith("bearer ")) {
            String token = header.substring(7);
            logger.info("Token: {}", token);
            try {
                String email = jwtUtil.extractEmail(token);
                logger.info("Email: {}", email);
                boolean valid = jwtUtil.validateToken(token, email);
                logger.info("Token valid: {}", valid);
                if (valid) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    logger.info("User: {}, Roles: {}", userDetails.getUsername(), userDetails.getAuthorities());
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.info("Auth set for {} {}", method, uri);
                } else {
                    logger.error("Invalid token for {} {}", method, uri);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } catch (Exception e) {
                logger.error("Token error for {} {}: {}", method, uri, e.getMessage(), e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token error");
                return;
            }
        } else {
            logger.warn("No Bearer token for {} {}", method, uri);
        }

        chain.doFilter(request, response);
    }
}
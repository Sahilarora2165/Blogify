package com.project.blog_application.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.project.blog_application.entities.Role;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class for handling JSON Web Token (JWT) operations such as generation, validation,
 * and extraction of claims. This class is a Spring component and uses configuration properties
 * for the secret key and expiration time.
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String SECRET_KEY; // Secret key injected from application.properties

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME; // Token expiration time in milliseconds, injected from application.properties

    /**
     * Generates a JWT token for a given email and role.
     * 
     * @param email The user's email to be set as the subject of the token.
     * @param role  The user's role, included as a claim with "ROLE_" prefix for Spring Security compatibility.
     * @return A signed JWT token as a String.
     */
    public String generateToken(String email, Role role) {
        // Convert the secret key string to a SecretKey object using HMAC-SHA algorithm
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        logger.info("Generating token for email: {} with secret (length: {}) and expiration: {}", 
                    email, SECRET_KEY.length(), EXPIRATION_TIME);

        // Build and sign the JWT token
        return Jwts.builder()
                .setSubject(email) // Set email as the subject (used for identification)
                .claim("role", "ROLE_" + role.name()) // Add role claim with Spring Security prefix
                .setIssuedAt(new Date()) // Set the issuance timestamp
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Set expiration time
                .signWith(key) // Sign the token with the secret key
                .compact(); // Generate the compact string representation
    }

    /**
     * Validates a JWT token by checking if it matches the provided email and is not expired.
     * 
     * @param token The JWT token to validate.
     * @param email The email to compare against the token's subject.
     * @return true if the token is valid and not expired, false otherwise.
     */
    public boolean validateToken(String token, String email) {
        try {
            String extractedEmail = extractEmail(token); // Extract the email from the token
            boolean isExpired = isTokenExpired(token); // Check if the token is expired
            logger.debug("Validating token: email match={} (extracted: {}), expired={}", 
                         extractedEmail.equals(email), extractedEmail, isExpired);
            return extractedEmail.equals(email) && !isExpired; // Return true if email matches and token is valid
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage()); // Log any parsing or validation errors
            return false; // Return false if token parsing fails (e.g., malformed, invalid signature)
        }
    }

    /**
     * Extracts the email (subject) from a JWT token.
     * 
     * @param token The JWT token to parse.
     * @return The email stored in the token's subject field.
     */
    public String extractEmail(String token) {
        return getClaims(token).getSubject(); // Retrieve the subject (email) from the token's claims
    }

    /**
     * Checks if a JWT token has expired.
     * 
     * @param token The JWT token to check.
     * @return true if the token is expired, false otherwise.
     */
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date()); // Compare expiration date with current time
    }

    /**
     * Parses the claims (payload) from a JWT token.
     * 
     * @param token The JWT token to parse.
     * @return The Claims object containing the token's payload.
     * @throws io.jsonwebtoken.JwtException if the token is invalid or cannot be parsed.
     */
    private Claims getClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8)); // Recreate the signing key
        logger.debug("Extracting claims with secret (length: {})", SECRET_KEY.length());

        // Parse the token and return its claims
        return Jwts.parserBuilder()
                .setSigningKey(key) // Set the key for signature verification
                .build()
                .parseClaimsJws(token) // Parse the signed JWT
                .getBody(); // Return the claims (payload)
    }

    /**
     * Extracts the role claim from a JWT token.
     * 
     * @param token The JWT token to parse.
     * @return The role as a String (e.g., "ROLE_USER" or "ROLE_ADMIN"), or null if not present.
     */
    public String getRole(String token) {
        return getClaims(token).get("role", String.class); // Retrieve the role claim
    }

    /**
     * Getter for testing or debugging purposes to access the secret key length.
     * 
     * @return The length of the secret key string.
     */
    public int getSecretKeyLength() {
        return SECRET_KEY.length(); // Added for validation or debugging
    }
}
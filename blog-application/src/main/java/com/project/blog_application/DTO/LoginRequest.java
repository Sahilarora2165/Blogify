package com.project.blog_application.DTO;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

public class LoginRequest {
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Password is required")
    private String password;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "LoginRequest{email='" + email + "', password='[hidden]'}";
    }
}
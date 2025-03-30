// package com.project.blog_application.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import lombok.NonNull;

// @Configuration
// public class CorsConfig implements WebMvcConfigurer {

//     @Override
//     public void addCorsMappings(@SuppressWarnings("null") @NonNull CorsRegistry registry) {
//         registry.addMapping("/**") // Apply to all endpoints
//                 .allowedOrigins("http://localhost:5173") // Allow React frontend origin (updated from 5174 to 5173)
//                 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
//                 .allowedHeaders("*") // Allow all headers (including Authorization)
//                 .allowCredentials(true); // Allow cookies/auth headers if needed
//     }
// }
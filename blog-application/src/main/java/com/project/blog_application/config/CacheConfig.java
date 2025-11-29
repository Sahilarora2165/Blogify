package com.project.blog_application.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cache configuration for performance optimization.
 * Uses ConcurrentMapCacheManager for in-memory caching of frequently accessed data.
 * 
 * Cached data:
 * - postCount: Total count of blog posts
 * - userCount: Total count of users
 * - commentCount: Total count of comments
 * - dashboardStats: Consolidated dashboard statistics
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("postCount", "userCount", "commentCount", "dashboardStats");
    }
}

package com.project.blog_application.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.blog_application.DTO.BlogPostDTO;
import com.project.blog_application.entities.BlogPost;
import com.project.blog_application.entities.User;
import com.project.blog_application.exceptions.ResourceNotFoundException;
import com.project.blog_application.repository.UserRepository;
import com.project.blog_application.services.BlogPostService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class BlogPostController {

    private static final Logger logger = LoggerFactory.getLogger(BlogPostController.class);

    private final BlogPostService blogPostService;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    public BlogPostController(BlogPostService blogPostService, UserRepository userRepository) {
        this.blogPostService = blogPostService;
        this.userRepository = userRepository;
    }

    // Testing the endpoint
    @GetMapping("/test")
    public String test() {
        return "Hello from BlogPostController";
    }

    // Endpoint to get all the blog posts
    @GetMapping
    public ResponseEntity<Page<BlogPostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        Page<BlogPost> blogPosts = blogPostService
                .getAllBlogPosts(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        // Convert Page<BlogPost> to Page<BlogPostDTO>
        Page<BlogPostDTO> blogPostDTOs = blogPosts.map(BlogPostDTO::new);

        return ResponseEntity.ok(blogPostDTOs);
    }

    // Endpoint to get a blog post by id
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long id) {
        try {
            BlogPost post = blogPostService.getBlogPostById(id);
            BlogPostDTO response = new BlogPostDTO(post);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Create blog post with optional image upload
    @PostMapping(consumes = "multipart/form-data", produces = "application/json")
    public ResponseEntity<BlogPostDTO> createPost(
            @RequestPart("blogPost") String blogPostJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }

            Optional<User> user = fetchAuthenticatedUser(userDetails);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            BlogPost blogPost = convertJsonToBlogPost(blogPostJson);
            blogPost.setUser(user.get());

            if (file != null && !file.isEmpty()) {
                String imageUrl = handleFileUpload(file);
                blogPost.setImageUrl(imageUrl);
            }

            BlogPost savedPost = blogPostService.createPost(blogPost, user.get());
            BlogPostDTO response = new BlogPostDTO(savedPost);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            logger.error("IOException occurred while creating the post", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private Optional<User> fetchAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername());
    }

    private BlogPost convertJsonToBlogPost(String blogPostJson) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(blogPostJson, BlogPost.class);
    }

    private String handleFileUpload(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        @SuppressWarnings("null")
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + uniqueFilename;
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long id,
            @RequestPart(value = "blogPost", required = false) String blogPostJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            BlogPost existingPost = blogPostService.getBlogPostById(id);
            if (existingPost == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Handle partial updates from JSON if provided
            if (blogPostJson != null && !blogPostJson.isEmpty()) {
                ObjectMapper objectMapper = new ObjectMapper();
                BlogPost updatedPost = objectMapper.readValue(blogPostJson, BlogPost.class);

                if (updatedPost.getTitle() != null && !updatedPost.getTitle().isEmpty()) {
                    existingPost.setTitle(updatedPost.getTitle());
                }
                if (updatedPost.getContent() != null && !updatedPost.getContent().isEmpty()) {
                    existingPost.setContent(updatedPost.getContent());
                }
            }

            // Handle optional image update
            if (file != null && !file.isEmpty()) {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = file.getOriginalFilename();
                @SuppressWarnings("null")
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String uniqueFilename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(uniqueFilename);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Update the relative image URL
                existingPost.setImageUrl("/uploads/" + uniqueFilename);
            }

            BlogPost savedPost = blogPostService.updatePost(id, existingPost);
            BlogPostDTO response = new BlogPostDTO(savedPost);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Only **authenticated users** can delete a post
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            blogPostService.deletePost(id);
            return ResponseEntity.ok("Post deleted");
        } catch (Exception e) {
            logger.error("Failed to delete post {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed: " + e.getMessage());
        }
    }
}
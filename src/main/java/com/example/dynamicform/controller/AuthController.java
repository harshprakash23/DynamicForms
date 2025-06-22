package com.example.dynamicform.controller;

import com.example.dynamicform.dto.AuthResponse;
import com.example.dynamicform.dto.LoginRequest;
import com.example.dynamicform.dto.RegisterRequest;
import com.example.dynamicform.entity.User;
import com.example.dynamicform.repository.UserRepository;
import com.example.dynamicform.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        logger.debug("Registering user with email: {}", registerRequest.getEmail());
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            logger.warn("Email already exists: {}", registerRequest.getEmail());
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.USER); // Default to USER role

        userRepository.save(user);
        logger.info("User registered successfully: {}", registerRequest.getEmail());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.debug("Logging in user with email: {}", loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            logger.debug("Extracted role: {}", role);
            String token = jwtUtil.generateToken(loginRequest.getEmail(), role);
            logger.info("User logged in successfully: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for email: {}, error: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        }
    }
}
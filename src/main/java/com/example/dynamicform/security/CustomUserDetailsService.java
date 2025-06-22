package com.example.dynamicform.security;

import com.example.dynamicform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);
        com.example.dynamicform.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
        logger.debug("User found: email={}, role={}", user.getEmail(), user.getRole());
        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}
package com.example.dynamicform.controller;

import com.example.dynamicform.entity.User;
import com.example.dynamicform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(403).build();
        }
        List<UserDto> users = userRepository.findAll().stream()
            .map(user -> new UserDto(user.getId(), user.getName()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}

record UserDto(Long id, String name) {}
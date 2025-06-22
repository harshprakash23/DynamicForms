package com.example.dynamicform.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}

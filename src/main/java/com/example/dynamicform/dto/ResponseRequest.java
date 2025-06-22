package com.example.dynamicform.dto;

import java.util.Map;

public class ResponseRequest {
    private String content; // Keep for backward compatibility
    private Map<String, Object> responses; // New dynamic responses
    private Long userId; // Add user ID for the responder

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Map<String, Object> getResponses() {
        return responses;
    }

    public void setResponses(Map<String, Object> responses) {
        this.responses = responses;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
package com.example.dynamicform.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ResponseDTO {
    private Long id;
    private Long formId;
    private Long userId; // Include user ID
    private String userName; // Include user name
    private List<ResponseDataDTO> responseData;
    private String content;
    private LocalDateTime submittedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getFormId() { return formId; }
    public void setFormId(Long formId) { this.formId = formId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public List<ResponseDataDTO> getResponseData() { return responseData != null ? responseData : new ArrayList<>(); }
    public void setResponseData(List<ResponseDataDTO> responseData) { this.responseData = responseData; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
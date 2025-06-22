package com.example.dynamicform.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import com.example.dynamicform.entity.User;
import java.time.LocalDateTime;

@Entity
@Table(name = "responses")
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to users table
    @JsonBackReference
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    @JsonBackReference
    private Form form;

    @Column(columnDefinition = "TEXT")
    private String content; // Kept for backward compatibility

    @Column(columnDefinition = "JSON")
    private String responseData; // Store JSON string of responses

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Form getForm() {
        return form;
    }

    public void setForm(Form form) {
        this.form = form;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getResponseData() {
        return responseData;
    }

    public void setResponseData(String responseData) {
        this.responseData = responseData;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
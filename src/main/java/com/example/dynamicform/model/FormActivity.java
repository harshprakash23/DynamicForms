package com.example.dynamicform.model;

import com.example.dynamicform.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "form_activities")
public class FormActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "activity_type", nullable = false)
    private String activityType; // "FORM_CREATED", "FORM_VIEWED", "FORM_UPDATED", "FORM_DELETED", "FORM_SUBMITTED"
    
    @Column(name = "activity_description")
    private String activityDescription;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    // Constructors
    public FormActivity() {}
    
    public FormActivity(Form form, User user, String activityType, String activityDescription) {
        this.form = form;
        this.user = user;
        this.activityType = activityType;
        this.activityDescription = activityDescription;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Form getForm() {
        return form;
    }
    
    public void setForm(Form form) {
        this.form = form;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getActivityType() {
        return activityType;
    }
    
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }
    
    public String getActivityDescription() {
        return activityDescription;
    }
    
    public void setActivityDescription(String activityDescription) {
        this.activityDescription = activityDescription;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}
package com.example.dynamicform.controller;

import com.example.dynamicform.model.Form;
import com.example.dynamicform.model.FormView;
import com.example.dynamicform.entity.User;
import com.example.dynamicform.repository.FormRepository;
import com.example.dynamicform.repository.FormViewRepository;
import com.example.dynamicform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);

    @Autowired
    private FormViewRepository formViewRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            logger.warn("Unauthenticated attempt to access recent activities");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(List.of(Map.of("error", "You must be authenticated to access recent activities")));
        }

        logger.debug("Fetching recent activities for user: {}", authentication.getName());
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Form> userForms = formRepository.findByUser(user);
            if (userForms.isEmpty()) {
                logger.info("No forms found for user: {}", userEmail);
                return ResponseEntity.ok(new ArrayList<>());
            }

            List<Long> formIds = userForms.stream().map(Form::getId).collect(Collectors.toList());

            List<FormView> formViews = formViewRepository.findTop10ByFormIdInOrderByViewedAtDesc(formIds);
            if (formViews.size() > 10) {
                formViews = formViews.subList(0, 10);
            }

            List<Map<String, Object>> activities = new ArrayList<>();

            for (FormView formView : formViews) {
                Form form = formRepository.findById(formView.getFormId()).orElse(null);
                if (form == null) continue;

                Map<String, Object> activity = new HashMap<>();
                activity.put("action", "Form viewed");
                activity.put("form", form.getTitle());
                activity.put("color", "bg-orange-500");

                LocalDateTime viewedAt = formView.getViewedAt();
                LocalDateTime now = LocalDateTime.now();
                long hoursDiff = ChronoUnit.HOURS.between(viewedAt, now);
                if (hoursDiff < 1) {
                    activity.put("time", "Just now");
                } else if (hoursDiff < 24) {
                    activity.put("time", hoursDiff + " hours ago");
                } else {
                    activity.put("time", (hoursDiff / 24) + " days ago");
                }

                Long userId = formView.getUserId();
                if (userId != null) {
                    User viewer = userRepository.findById(userId).orElse(null);
                    if (viewer != null) {
                        activity.put("user_name", viewer.getName());
                        activity.put("user_id", String.valueOf(userId));
                    } else {
                        activity.put("user_name", "Unknown User");
                        activity.put("user_id", String.valueOf(userId));
                    }
                } else {
                    activity.put("user_name", "Anonymous");
                    activity.put("user_id", null);
                }

                activities.add(activity);
            }

            logger.info("Retrieved {} activities for user: {}", activities.size(), userEmail);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            logger.error("Error fetching activities: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "Failed to fetch activities: " + e.getMessage())));
        }
    }
}
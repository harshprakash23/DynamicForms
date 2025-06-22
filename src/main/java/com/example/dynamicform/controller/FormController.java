package com.example.dynamicform.controller;

import com.example.dynamicform.dto.FormRequest;
import com.example.dynamicform.dto.QuestionDto;
import com.example.dynamicform.dto.ResponseDTO;
import com.example.dynamicform.dto.ResponseRequest;
import com.example.dynamicform.model.Form;
import com.example.dynamicform.model.FormView;
import com.example.dynamicform.model.Question;
import com.example.dynamicform.model.Response;
import com.example.dynamicform.entity.User;
import com.example.dynamicform.repository.FormRepository;
import com.example.dynamicform.repository.FormViewRepository;
import com.example.dynamicform.repository.QuestionRepository;
import com.example.dynamicform.repository.ResponseRepository;
import com.example.dynamicform.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/forms")
public class FormController {

    private static final Logger logger = LoggerFactory.getLogger(FormController.class);

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private FormViewRepository formViewRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<Map<String, String>> createForm(@RequestBody FormRequest formRequest,
            Authentication authentication) {
        logger.debug("Creating form for user: {}", authentication.getName());
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Form form = new Form();
            form.setTitle(formRequest.getTitle());
            form.setDescription(formRequest.getDescription());
            form.setUser(user);
            form.setCreatedAt(LocalDateTime.now());

            Form savedForm = formRepository.save(form);

            if (formRequest.getQuestions() != null && !formRequest.getQuestions().isEmpty()) {
                for (QuestionDto questionDto : formRequest.getQuestions()) {
                    Question question = new Question();
                    question.setForm(savedForm);
                    question.setType(questionDto.getType());
                    question.setQuestion(questionDto.getQuestion());
                    question.setRequired(questionDto.isRequired());
                    question.setOptions(questionDto.getOptions());
                    question.setMinValue(questionDto.getMin());
                    question.setMaxValue(questionDto.getMax());

                    questionRepository.save(question);
                }
            }

            logger.info("Form created successfully for user: {}", userEmail);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Form created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating form: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to create form: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<List<Form>> getForms(Authentication authentication) {
        logger.debug("Fetching forms for user: {}", authentication.getName());
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Form> forms = formRepository.findByUser(user);
            logger.info("Retrieved {} forms for user: {}", forms.size(), userEmail);
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            logger.error("Error fetching forms: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Form> getFormById(@PathVariable Long id) {
        logger.debug("Fetching form with id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));
            logger.info("Form retrieved successfully: id {}", id);
            return ResponseEntity.ok(form);
        } catch (Exception e) {
            logger.error("Error fetching form: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{id}/respond")
    public ResponseEntity<Map<String, Object>> getFormForResponse(@PathVariable Long id,
            Authentication authentication) {
        logger.debug("Fetching form for response, form ID: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            String userEmail = authentication != null ? authentication.getName() : null;
            Long userId = userEmail != null ? userRepository.findByEmail(userEmail)
                    .map(User::getId)
                    .orElse(null) : null;

            if (userId != null) {
                LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
                Optional<FormView> recentView = formViewRepository.findRecentViewByUserAndForm(id, userId,
                        fiveMinutesAgo);

                if (recentView.isEmpty()) {
                    FormView formView = new FormView();
                    formView.setFormId(id);
                    formView.setUserId(userId);
                    formView.setViewedAt(LocalDateTime.now());
                    formViewRepository.save(formView);
                    logger.info("Form view logged for form ID: {} by user: {}", id, userEmail);

                    form.setViewCount(form.getViewCount() + 1);
                    formRepository.save(form);
                } else {
                    logger.debug("Form view already logged recently for form ID: {} by user: {}", id, userEmail);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", form.getId());
            response.put("title", form.getTitle());
            response.put("description", form.getDescription());
            response.put("fields", form.getQuestions());
            response.put("message", "Form retrieved for response successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching form for response: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch form for response: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<Map<String, String>> submitResponse(@PathVariable Long id,
            @RequestBody ResponseRequest responseRequest, Authentication authentication) {
        logger.debug("Submitting response for form id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            Response response = new Response();
            response.setForm(form);
            response.setSubmittedAt(LocalDateTime.now());

            // Set the user who submitted the response
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            response.setUser(user);

            if (responseRequest.getResponses() != null && !responseRequest.getResponses().isEmpty()) {
                String responseDataJson = objectMapper.writeValueAsString(responseRequest.getResponses());
                response.setResponseData(responseDataJson);

                if (responseRequest.getContent() != null) {
                    response.setContent(responseRequest.getContent());
                }
            } else if (responseRequest.getContent() != null) {
                response.setContent(responseRequest.getContent());
            } else {
                throw new IllegalArgumentException("Response data is required");
            }

            responseRepository.save(response);

            logger.info("Response submitted successfully for form id: {} by user: {}", id, userEmail);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("message", "Response submitted successfully");
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            logger.error("Error submitting response: {}", e.getMessage(), e);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("error", "Failed to submit response: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    @GetMapping("/{id}/responses")
    public ResponseEntity<List<ResponseDTO>> getFormResponses(@PathVariable Long id, Authentication authentication) {
        logger.debug("Fetching responses for form id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            String userEmail = authentication.getName();
            if (!form.getUser().getEmail().equals(userEmail)) {
                logger.warn("User {} attempted to access responses for form id: {} but is not the creator", userEmail, id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }

            List<Response> responses = responseRepository.findByForm(form);
            List<ResponseDTO> responseDTOs = responses.stream().map(response -> {
                ResponseDTO dto = new ResponseDTO();
                dto.setId(response.getId());
                dto.setFormId(response.getForm().getId());
                dto.setUserId(response.getUser() != null ? response.getUser().getId() : null);
                dto.setUserName(response.getUser() != null ? response.getUser().getName() : null);
                dto.setContent(response.getContent());
                dto.setSubmittedAt(response.getSubmittedAt());
                // Parse responseData if needed (optional, add if required)
                // dto.setResponseData(/* parse logic if needed */);
                return dto;
            }).toList();

            if (responses.isEmpty()) {
                logger.warn("No responses found for form id: {}", id);
            } else {
                logger.info("Retrieved {} responses for form id: {}. Data: {}", responses.size(), id, responseDTOs);
            }
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            logger.error("Error fetching responses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteForm(@PathVariable Long id, Authentication authentication) {
        logger.debug("Deleting form with id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            String userEmail = authentication.getName();
            if (!form.getUser().getEmail().equals(userEmail)) {
                logger.warn("User {} attempted to delete form id: {} but is not the creator", userEmail, id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not authorized to delete this form"));
            }

            formRepository.delete(form);
            logger.info("Form deleted successfully: id {}", id);
            return ResponseEntity.ok(Map.of("message", "Form deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting form: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete form: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateForm(@PathVariable Long id, @RequestBody FormRequest formRequest,
            Authentication authentication) {
        logger.debug("Updating form with id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            String userEmail = authentication.getName();
            if (!form.getUser().getEmail().equals(userEmail)) {
                logger.warn("User {} attempted to update form id: {} but is not the creator", userEmail, id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You are not authorized to update this form"));
            }

            form.setTitle(formRequest.getTitle());
            form.setDescription(formRequest.getDescription());

            if (formRequest.getQuestions() != null) {
                questionRepository.deleteAll(form.getQuestions());
                form.getQuestions().clear();

                for (QuestionDto questionDto : formRequest.getQuestions()) {
                    Question question = new Question();
                    question.setForm(form);
                    question.setType(questionDto.getType());
                    question.setQuestion(questionDto.getQuestion());
                    question.setRequired(questionDto.isRequired());
                    question.setOptions(questionDto.getOptions());
                    question.setMinValue(questionDto.getMin());
                    question.setMaxValue(questionDto.getMax());

                    questionRepository.save(question);
                }
            }

            formRepository.save(form);

            logger.info("Form updated successfully: id {}", id);
            return ResponseEntity.ok(Map.of("message", "Form updated successfully"));
        } catch (Exception e) {
            logger.error("Error updating form: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update form: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Map<String, String>> logFormView(
            @PathVariable Long id,
            @RequestParam String ipAddress,
            @RequestParam(required = false) Long userId,
            Authentication authentication) {
        logger.debug("Logging view for form id: {}", id);
        try {
            Form form = formRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            // Determine userId from Authentication if not provided
            Long finalUserId = userId;
            if (finalUserId == null && authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {
                String userEmail = authentication.getName();
                User user = userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                finalUserId = user.getId();
                logger.debug("User ID determined from authentication: {}", finalUserId);
            }

            LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
            boolean shouldLogView = false;

            if (finalUserId != null) {
                Optional<FormView> recentView = formViewRepository.findRecentViewByUserAndForm(id, finalUserId,
                        fiveMinutesAgo);
                if (recentView.isEmpty()) {
                    shouldLogView = true;
                } else {
                    logger.debug("Form view already logged recently for form ID: {} by user ID: {}", id, finalUserId);
                }
            } else {
                Optional<FormView> recentView = formViewRepository.findRecentViewByIpAddress(id, ipAddress,
                        fiveMinutesAgo);
                if (recentView.isEmpty()) {
                    shouldLogView = true;
                } else {
                    logger.debug("Form view already logged recently for form ID: {} by IP: {}", id, ipAddress);
                }
            }

            if (shouldLogView) {
                FormView formView = new FormView();
                formView.setFormId(id);
                formView.setIpAddress(ipAddress);
                formView.setUserId(finalUserId);
                formView.setViewedAt(LocalDateTime.now());
                formViewRepository.save(formView);

                form.setViewCount(form.getViewCount() + 1);
                formRepository.save(form);

                logger.info("Form view logged successfully for form id: {} with user ID: {}", id, finalUserId);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Form view logged successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error logging form view: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to log form view: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
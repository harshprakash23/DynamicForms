package com.example.dynamicform.security;

import com.example.dynamicform.util.JwtUtil;
import com.example.dynamicform.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        if (token != null) {
            logger.debug("Processing token: {}", token);
            try {
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.extractEmail(token);
                    if (email == null) {
                        logger.warn("Failed to extract email from token");
                        filterChain.doFilter(request, response);
                        return;
                    }
                    String role = jwtUtil.extractRole(token);
                    logger.debug("Token validated successfully, extracted email: {}, role: {}", email, role);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    // Normalize the role from the token to match userDetails authorities
                    String normalizedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    if (!userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals(normalizedRole))) {
                        logger.warn("Role in token ({}) does not match user's authorities", role);
                        filterChain.doFilter(request, response);
                        return;
                    }
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentication set for user: {}", email);
                } else {
                    logger.warn("Token validation failed");
                }
            } catch (Exception e) {
                logger.error("Error processing token: {}", e.getMessage());
            }
        } else {
            logger.debug("No token found in request");
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
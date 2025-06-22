package com.example.dynamicform.repository;

import com.example.dynamicform.model.Response;
import com.example.dynamicform.model.Form;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    @EntityGraph(attributePaths = {"form", "user"}) // Eagerly load form and user
    List<Response> findByForm(Form form);
}
package com.example.dynamicform.repository;

import com.example.dynamicform.model.Question;
import com.example.dynamicform.model.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByForm(Form form);
}
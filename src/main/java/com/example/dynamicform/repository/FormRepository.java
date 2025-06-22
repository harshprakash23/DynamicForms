package com.example.dynamicform.repository;

import com.example.dynamicform.model.Form;
import com.example.dynamicform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findByUser(User user);
}
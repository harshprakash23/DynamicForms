package com.example.dynamicform.repository;

import com.example.dynamicform.model.FormView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FormViewRepository extends JpaRepository<FormView, Long> {

    @Query("SELECT fv FROM FormView fv WHERE fv.formId IN :formIds ORDER BY fv.viewedAt DESC")
    List<FormView> findTop10ByFormIdInOrderByViewedAtDesc(List<Long> formIds);

    @Query("SELECT fv FROM FormView fv WHERE fv.formId = :formId AND fv.userId = :userId AND fv.viewedAt >= :since ORDER BY fv.viewedAt DESC")
    Optional<FormView> findRecentViewByUserAndForm(Long formId, Long userId, LocalDateTime since);

    @Query("SELECT fv FROM FormView fv WHERE fv.formId = :formId AND fv.ipAddress = :ipAddress AND fv.viewedAt >= :since ORDER BY fv.viewedAt DESC")
    Optional<FormView> findRecentViewByIpAddress(Long formId, String ipAddress, LocalDateTime since);
}
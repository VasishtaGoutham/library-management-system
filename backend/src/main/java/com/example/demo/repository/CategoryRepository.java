package com.example.demo.repository;

import com.example.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsDeletedFalse();
    Optional<Category> findByIdAndIsDeletedFalse(Long id);
    Boolean existsByNameAndIsDeletedFalse(String name);
    Optional<Category> findByName(String name);
}

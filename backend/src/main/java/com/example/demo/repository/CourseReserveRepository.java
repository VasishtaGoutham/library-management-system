package com.example.demo.repository;

import com.example.demo.model.CourseReserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseReserveRepository extends JpaRepository<CourseReserve, Long> {
    List<CourseReserve> findAllByOrderByCreatedAtDesc();
    List<CourseReserve> findByDepartmentOrderByCreatedAtDesc(String department);
}

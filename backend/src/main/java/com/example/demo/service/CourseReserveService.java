package com.example.demo.service;

import com.example.demo.dto.CourseReserveResponse;
import com.example.demo.dto.CreateCourseReserveRequest;
import com.example.demo.model.Book;
import com.example.demo.model.CopyStatus;
import com.example.demo.model.CourseReserve;
import com.example.demo.repository.BookCopyRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CourseReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseReserveService {

    private final CourseReserveRepository courseReserveRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    public List<CourseReserveResponse> getAllReserves() {
        return courseReserveRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseReserveResponse createReserve(CreateCourseReserveRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        CourseReserve reserve = CourseReserve.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .department(request.getDepartment())
                .instructor(request.getInstructor())
                .semester(request.getSemester())
                .book(book)
                .requirementType(request.getRequirementType())
                .build();

        CourseReserve saved = courseReserveRepository.save(reserve);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteReserve(Long id) {
        courseReserveRepository.deleteById(id);
    }

    private CourseReserveResponse convertToResponse(CourseReserve r) {
        Long count = bookCopyRepository.countByBookIdAndStatus(r.getBook().getId(), CopyStatus.AVAILABLE);
        int availableCount = count != null ? count.intValue() : 0;

        return CourseReserveResponse.builder()
                .id(r.getId())
                .courseCode(r.getCourseCode())
                .courseName(r.getCourseName())
                .department(r.getDepartment())
                .instructor(r.getInstructor())
                .semester(r.getSemester())
                .bookId(r.getBook().getId())
                .bookTitle(r.getBook().getTitle())
                .bookAuthor(r.getBook().getAuthor())
                .bookIsbn(r.getBook().getIsbn())
                .availableCopies(availableCount)
                .requirementType(r.getRequirementType())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

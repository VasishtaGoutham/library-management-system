package com.example.demo.controller;

import com.example.demo.dto.BookDto;
import com.example.demo.model.BookCopy;
import com.example.demo.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<Page<BookDto>> getBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookService.getBooks(query, categoryId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BookDto> createBook(
            @RequestBody BookDto bookDto,
            @RequestParam(defaultValue = "1") int initialCopies
    ) {
        return ResponseEntity.ok(bookService.createBook(bookDto, initialCopies));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, @RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/copies")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BookCopy> addCopy(
            @PathVariable Long id,
            @RequestParam(required = false) String rackLocation
    ) {
        return ResponseEntity.ok(bookService.addCopy(id, rackLocation));
    }

    @GetMapping("/{id}/copies")
    public ResponseEntity<List<BookCopy>> getCopies(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getCopiesForBook(id));
    }
}

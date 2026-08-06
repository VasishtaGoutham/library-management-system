package com.example.demo.service;

import com.example.demo.dto.BookDto;
import com.example.demo.model.Book;
import com.example.demo.model.BookCopy;
import com.example.demo.model.Category;
import com.example.demo.model.CopyStatus;
import com.example.demo.repository.BookCopyRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookCopyRepository bookCopyRepository;

    public Page<BookDto> getBooks(String query, Long categoryId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Book> booksPage = bookRepository.searchBooks(query, categoryId, pageRequest);

        return booksPage.map(this::convertToDto);
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return convertToDto(book);
    }

    @Transactional
    public BookDto createBook(BookDto dto, int initialCopiesCount) {
        if (bookRepository.existsByIsbnAndIsDeletedFalse(dto.getIsbn())) {
            throw new RuntimeException("Book with ISBN " + dto.getIsbn() + " already exists!");
        }

        Category category = categoryRepository.findByIdAndIsDeletedFalse(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        Book book = Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .isbn(dto.getIsbn())
                .publisher(dto.getPublisher())
                .edition(dto.getEdition())
                .publicationYear(dto.getPublicationYear())
                .language(dto.getLanguage() != null ? dto.getLanguage() : "English")
                .description(dto.getDescription())
                .coverImageUrl(dto.getCoverImageUrl())
                .category(category)
                .isDeleted(false)
                .build();

        Book savedBook = bookRepository.save(book);

        for (int i = 1; i <= Math.max(1, initialCopiesCount); i++) {
            String cleanIsbn = savedBook.getIsbn().replaceAll("[^0-9A-Za-z]", "");
            String suffix = cleanIsbn.substring(Math.max(0, cleanIsbn.length() - 4));
            String barcode = "LIB-" + suffix + "-" + String.format("%03d", i);
            BookCopy copy = BookCopy.builder()
                    .book(savedBook)
                    .barcode(barcode)
                    .status(CopyStatus.AVAILABLE)
                    .rackLocation("Rack A-" + category.getId())
                    .build();
            bookCopyRepository.save(copy);
        }

        return convertToDto(savedBook);
    }

    @Transactional
    public BookDto updateBook(Long id, BookDto dto) {
        Book book = bookRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        Category category = categoryRepository.findByIdAndIsDeletedFalse(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setPublisher(dto.getPublisher());
        book.setEdition(dto.getEdition());
        book.setPublicationYear(dto.getPublicationYear());
        book.setLanguage(dto.getLanguage());
        book.setDescription(dto.getDescription());
        book.setCoverImageUrl(dto.getCoverImageUrl());
        book.setCategory(category);

        Book updatedBook = bookRepository.save(book);
        return convertToDto(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        book.setDeleted(true);
        bookRepository.save(book);
    }

    @Transactional
    public BookCopy addCopy(Long bookId, String rackLocation) {
        Book book = bookRepository.findByIdAndIsDeletedFalse(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        Long copyCount = bookCopyRepository.countByBookId(bookId);
        String cleanIsbn = book.getIsbn().replaceAll("[^0-9A-Za-z]", "");
        String suffix = cleanIsbn.substring(Math.max(0, cleanIsbn.length() - 4));
        String barcode = "LIB-" + suffix + "-" + String.format("%03d", copyCount + 1);

        BookCopy copy = BookCopy.builder()
                .book(book)
                .barcode(barcode)
                .status(CopyStatus.AVAILABLE)
                .rackLocation(rackLocation != null ? rackLocation : "Rack Main")
                .build();

        return bookCopyRepository.save(copy);
    }

    public List<BookCopy> getCopiesForBook(Long bookId) {
        return bookCopyRepository.findByBookId(bookId);
    }

    private BookDto convertToDto(Book book) {
        Long totalCopies = bookCopyRepository.countByBookId(book.getId());
        Long availableCopies = bookCopyRepository.countByBookIdAndStatus(book.getId(), CopyStatus.AVAILABLE);

        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .edition(book.getEdition())
                .publicationYear(book.getPublicationYear())
                .language(book.getLanguage())
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .categoryId(book.getCategory() != null ? book.getCategory().getId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .totalCopies(totalCopies)
                .availableCopies(availableCopies)
                .build();
    }
}

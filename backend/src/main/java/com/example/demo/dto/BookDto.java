package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private String edition;
    private Integer publicationYear;
    private String language;
    private String description;
    private String coverImageUrl;
    private Long categoryId;
    private String categoryName;
    private Long totalCopies;
    private Long availableCopies;
}

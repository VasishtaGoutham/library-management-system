package com.example.demo.service;

import com.example.demo.dto.HoldResponse;
import com.example.demo.model.Book;
import com.example.demo.model.HoldRequest;
import com.example.demo.model.HoldStatus;
import com.example.demo.model.User;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.HoldRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HoldService {

    private final HoldRepository holdRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public HoldResponse requestHold(Long bookId, Long studentId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (holdRepository.existsByBookIdAndStudentIdAndStatus(bookId, studentId, HoldStatus.PENDING)) {
            throw new RuntimeException("You already have an active hold request for this book!");
        }

        long currentQueueCount = holdRepository.countByBookIdAndStatus(bookId, HoldStatus.PENDING);
        int queuePosition = (int) currentQueueCount + 1;

        HoldRequest hold = HoldRequest.builder()
                .book(book)
                .student(student)
                .status(HoldStatus.PENDING)
                .queuePosition(queuePosition)
                .build();

        HoldRequest saved = holdRepository.save(hold);

        return convertToResponse(saved);
    }

    public List<HoldResponse> getMyHolds(Long studentId) {
        return holdRepository.findByStudentIdOrderByRequestDateDesc(studentId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void cancelHold(Long holdId, Long studentId) {
        HoldRequest hold = holdRepository.findById(holdId)
                .orElseThrow(() -> new RuntimeException("Hold request not found"));

        if (!hold.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized to cancel this hold request");
        }

        hold.setStatus(HoldStatus.CANCELLED);
        holdRepository.save(hold);
    }

    public void processNextHoldIfAvailable(Long bookId) {
        Optional<HoldRequest> nextHoldOpt = holdRepository.findFirstByBookIdAndStatusOrderByRequestDateAsc(bookId, HoldStatus.PENDING);
        if (nextHoldOpt.isPresent()) {
            HoldRequest hold = nextHoldOpt.get();
            hold.setStatus(HoldStatus.FULFILLED);
            hold.setFulfilledAt(LocalDateTime.now());
            holdRepository.save(hold);

            emailService.sendHoldNotification(
                    hold.getStudent().getFullName(),
                    hold.getStudent().getEmail(),
                    hold.getBook().getTitle()
            );
        }
    }

    private HoldResponse convertToResponse(HoldRequest hold) {
        return HoldResponse.builder()
                .id(hold.getId())
                .bookId(hold.getBook().getId())
                .bookTitle(hold.getBook().getTitle())
                .bookAuthor(hold.getBook().getAuthor())
                .coverImageUrl(hold.getBook().getCoverImageUrl())
                .studentId(hold.getStudent().getId())
                .studentName(hold.getStudent().getFullName())
                .studentEmail(hold.getStudent().getEmail())
                .status(hold.getStatus())
                .queuePosition(hold.getQueuePosition())
                .requestDate(hold.getRequestDate())
                .fulfilledAt(hold.getFulfilledAt())
                .build();
    }
}

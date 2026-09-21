package com.contappa.core.exceptions;

import com.contappa.core.dto.error.ErrorDTO;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
        ProductNotFoundException.class,
        TableNotFoundException.class,
        CategoryNotFoundException.class,
        BillNotFoundException.class
    })
    public ResponseEntity<ErrorDTO> handleNotFound(RuntimeException ex) {
        return respond(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDTO> handleBadRequest(IllegalArgumentException ex) {
        return respond(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDTO> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(error -> error.getField() + " " + error.getDefaultMessage())
            .orElse("Request is not valid.");
        return respond(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDTO> handleConflict(DataIntegrityViolationException ex) {
        return respond(HttpStatus.CONFLICT, "This record is still referenced by other data and cannot be removed.");
    }

    private ResponseEntity<ErrorDTO> respond(HttpStatus status, String message) {
        ErrorDTO error = new ErrorDTO();
        error.setCode(status.value());
        error.setMessage(message);
        return ResponseEntity.status(status).body(error);
    }
}

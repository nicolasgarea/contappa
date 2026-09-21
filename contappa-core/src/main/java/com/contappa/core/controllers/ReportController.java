package com.contappa.core.controllers;

import com.contappa.core.dto.report.DailyReportDTO;
import com.contappa.core.dto.report.ProductReportDTO;
import com.contappa.core.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/daily")
    public ResponseEntity<DailyReportDTO> daily(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam(required = false) String zone
    ) {
        ZoneId zoneId;
        try {
            zoneId = zone == null ? ZoneId.systemDefault() : ZoneId.of(zone);
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Unknown time zone: " + zone);
        }
        LocalDate day = date == null ? LocalDate.now(zoneId) : date;
        return ResponseEntity.ok(reportService.daily(day, zoneId));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductReportDTO> product(@PathVariable UUID productId) {
        return ResponseEntity.ok(reportService.product(productId));
    }
}

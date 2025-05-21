package com.contappa.core.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "table_id", referencedColumnName = "id")
    private Table table;


    public Bill(){

    }

    public Bill(BigDecimal amount, LocalDate date, String status, LocalDateTime createdAt, LocalDateTime updatedAt, Table table) {
        this.amount = amount;
        this.date = date;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.table = table;
    }
}

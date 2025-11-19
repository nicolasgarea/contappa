package com.contappa.core.models;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "status")
    private String status;

    @Column(name = "paid")
    private boolean paid;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "table_id", referencedColumnName = "id")
    private Tables table;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillProduct> billProducts = new ArrayList<>();


    public Bill(){

    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public Bill(BigDecimal amount, LocalDate date, String status, LocalDateTime createdAt, LocalDateTime updatedAt, Tables table) {
        this.amount = amount;
        this.date = date;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.table = table;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Tables getTable() {
        return table;
    }

    public void setTable(Tables table) {
        this.table = table;
    }

    public List<BillProduct> getBillProducts() { return billProducts; }

    public void setBillProducts(List<BillProduct> billProducts) { this.billProducts = billProducts; }
}


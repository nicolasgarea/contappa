package com.contappa.core.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BillDTO {

    private String id;
    private BigDecimal amount;
    private LocalDate date;
    private List<ProductQuantity> products;

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public List<ProductQuantity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductQuantity> products) {
        this.products = products;
    }

    public static class ProductQuantity {
        private String productId;
        private int quantity;

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}

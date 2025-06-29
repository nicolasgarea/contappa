package com.contappa.core.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class TablesDTO {
    private int number;
    private UUID id;

    private List<ProductQuantity> products;

    public List<ProductQuantity> getProducts() {
        return products;
    }

    public void setProducts(List<ProductQuantity> products) {
        this.products = products;
    }

    public UUID getId(){ return id; }

    public void setId(UUID id){this.id = id;}
    
    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public static class ProductQuantity {
        private String id;
        private String name;
        private BigDecimal price;
        private int quantity;


        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}

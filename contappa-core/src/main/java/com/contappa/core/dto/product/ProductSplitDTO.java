package com.contappa.core.dto.product;

import java.util.UUID;

public class ProductSplitDTO {
    private UUID productId;
    private int quantity;

    public ProductSplitDTO(UUID productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}

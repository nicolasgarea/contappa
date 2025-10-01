package com.contappa.core.dto.product;

import java.util.List;

public class SplitDTO {
    private List<ProductSplitDTO> products;


    public SplitDTO(List<ProductSplitDTO> products) {
        this.products = products;
    }

    public List<ProductSplitDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductSplitDTO> products) {
        this.products = products;
    }
}

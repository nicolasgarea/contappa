package com.contappa.core.dto;

import java.util.List;

public class UpdateTableRequestDTO {
    private List<String> productList;

    public List<String> getProductList() {
        return productList;
    }

    public void setProductList(List<String> productList) {
        this.productList = productList;
    }
}

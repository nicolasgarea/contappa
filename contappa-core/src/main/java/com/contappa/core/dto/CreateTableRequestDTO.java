package com.contappa.core.dto;

import java.util.List;

public class CreateTableRequestDTO {
    private int number;
    private List<String> productList;

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}

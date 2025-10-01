package com.contappa.core.dto.table;

import java.util.UUID;

public class TablesDTO {
    private int number;
    private UUID id;

    public UUID getId(){ return id; }

    public void setId(UUID id){this.id = id;}

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}

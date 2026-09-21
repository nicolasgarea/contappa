package com.contappa.core.dto.table;

import com.contappa.core.dto.bill.BillDTO;

import java.util.List;
import java.util.UUID;

public class TablesDTO {
    private int number;
    private String name;
    private int capacity;
    private UUID id;
    private List<BillDTO> activeBills;

    public UUID getId(){ return id; }

    public List<BillDTO> getActiveBills() {
        return activeBills;
    }

    public void setActiveBills(List<BillDTO> activeBills) {
        this.activeBills = activeBills;
    }

    public void setId(UUID id){this.id = id;}

    public int getNumber() {
        return number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}

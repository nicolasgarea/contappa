package com.contappa.core.dto.table;

import com.contappa.core.dto.bill.BillDTO;

import java.util.UUID;

public class TablesDTO {
    private int number;
    private UUID id;
    private BillDTO activeBill;

    public UUID getId(){ return id; }

    public BillDTO getActiveBill() {
        return activeBill;
    }

    public void setActiveBill(BillDTO activeBill) {
        this.activeBill = activeBill;
    }

    public void setId(UUID id){this.id = id;}

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }
}

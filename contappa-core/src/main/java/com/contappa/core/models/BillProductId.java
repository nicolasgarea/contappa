package com.contappa.core.models;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class BillProductId implements Serializable {
    private UUID bill;
    private UUID product;

    public BillProductId() {}

    public BillProductId(UUID bill, UUID product) {
        this.bill = bill;
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof BillProductId that)) return false;
        return Objects.equals(bill, that.bill) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bill, product);
    }
}

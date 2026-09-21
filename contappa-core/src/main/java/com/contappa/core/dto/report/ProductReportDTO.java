package com.contappa.core.dto.report;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class ProductReportDTO {
    private UUID productId;
    private int unitsSold;
    private BigDecimal revenue;
    private int billsSold;
    private OffsetDateTime lastSoldAt;
    private int unitsOpen;
    private int tablesOpen;

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public int getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(int unitsSold) {
        this.unitsSold = unitsSold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public int getBillsSold() {
        return billsSold;
    }

    public void setBillsSold(int billsSold) {
        this.billsSold = billsSold;
    }

    public OffsetDateTime getLastSoldAt() {
        return lastSoldAt;
    }

    public void setLastSoldAt(OffsetDateTime lastSoldAt) {
        this.lastSoldAt = lastSoldAt;
    }

    public int getUnitsOpen() {
        return unitsOpen;
    }

    public void setUnitsOpen(int unitsOpen) {
        this.unitsOpen = unitsOpen;
    }

    public int getTablesOpen() {
        return tablesOpen;
    }

    public void setTablesOpen(int tablesOpen) {
        this.tablesOpen = tablesOpen;
    }
}

package com.contappa.core.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DailyReportDTO {
    private LocalDate date;
    private BigDecimal revenue;
    private BigDecimal openAmount;
    private int billsPaid;
    private int billsOpen;
    private int guestsServed;
    private BigDecimal averageTicket;
    private List<HourlySales> hourly;
    private List<ProductSales> topProducts;
    private List<CategorySales> categories;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getOpenAmount() {
        return openAmount;
    }

    public void setOpenAmount(BigDecimal openAmount) {
        this.openAmount = openAmount;
    }

    public int getBillsPaid() {
        return billsPaid;
    }

    public void setBillsPaid(int billsPaid) {
        this.billsPaid = billsPaid;
    }

    public int getBillsOpen() {
        return billsOpen;
    }

    public void setBillsOpen(int billsOpen) {
        this.billsOpen = billsOpen;
    }

    public int getGuestsServed() {
        return guestsServed;
    }

    public void setGuestsServed(int guestsServed) {
        this.guestsServed = guestsServed;
    }

    public BigDecimal getAverageTicket() {
        return averageTicket;
    }

    public void setAverageTicket(BigDecimal averageTicket) {
        this.averageTicket = averageTicket;
    }

    public List<HourlySales> getHourly() {
        return hourly;
    }

    public void setHourly(List<HourlySales> hourly) {
        this.hourly = hourly;
    }

    public List<ProductSales> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<ProductSales> topProducts) {
        this.topProducts = topProducts;
    }

    public List<CategorySales> getCategories() {
        return categories;
    }

    public void setCategories(List<CategorySales> categories) {
        this.categories = categories;
    }

    public record HourlySales(int hour, BigDecimal revenue, int bills) {
    }

    public record ProductSales(String name, String imageUrl, int quantity, BigDecimal revenue) {
    }

    public record CategorySales(String name, BigDecimal revenue) {
    }
}

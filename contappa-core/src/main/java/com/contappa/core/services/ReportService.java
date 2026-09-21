package com.contappa.core.services;

import com.contappa.core.dto.report.DailyReportDTO;
import com.contappa.core.dto.report.ProductReportDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import com.contappa.core.repositories.BillProductRepository;
import com.contappa.core.repositories.BillRepository;
import com.contappa.core.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.UUID;

@Service
public class ReportService {
    private static final int TOP_PRODUCTS = 6;

    private final BillRepository billRepository;
    private final BillProductRepository billProductRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ReportService(
        BillRepository billRepository,
        BillProductRepository billProductRepository,
        ProductRepository productRepository
    ) {
        this.billRepository = billRepository;
        this.billProductRepository = billProductRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public ProductReportDTO product(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product not found with id " + productId);
        }

        List<BillProduct> lines = billProductRepository.findByProductId(productId);
        List<BillProduct> sold = lines.stream().filter(line -> line.getBill().isPaid()).toList();
        List<BillProduct> open = lines.stream().filter(line -> !line.getBill().isPaid()).toList();

        ProductReportDTO report = new ProductReportDTO();
        report.setProductId(productId);
        report.setUnitsSold(sold.stream().mapToInt(BillProduct::getQuantity).sum());
        report.setRevenue(sold.stream()
            .map(line -> line.getUnitPrice().multiply(BigDecimal.valueOf(line.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add));
        report.setBillsSold(sold.size());
        report.setLastSoldAt(sold.stream()
            .map(line -> line.getBill().getCreatedAt())
            .filter(Objects::nonNull)
            .max(Comparator.naturalOrder())
            .orElse(null));
        report.setUnitsOpen(open.stream().mapToInt(BillProduct::getQuantity).sum());
        report.setTablesOpen((int) open.stream()
            .map(line -> line.getBill().getTable())
            .filter(Objects::nonNull)
            .map(table -> table.getId())
            .distinct()
            .count());
        return report;
    }

    @Transactional(readOnly = true)
    public DailyReportDTO daily(LocalDate date, ZoneId zone) {
        OffsetDateTime from = date.atStartOfDay(zone).toOffsetDateTime();
        OffsetDateTime to = date.plusDays(1).atStartOfDay(zone).toOffsetDateTime();
        List<Bill> bills = billRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(from, to);
        List<Bill> paid = bills.stream().filter(Bill::isPaid).toList();
        List<Bill> open = bills.stream().filter(bill -> !bill.isPaid()).toList();

        BigDecimal revenue = sum(paid);

        DailyReportDTO report = new DailyReportDTO();
        report.setDate(date);
        report.setRevenue(revenue);
        report.setOpenAmount(sum(open));
        report.setBillsPaid(paid.size());
        report.setBillsOpen(open.size());
        report.setGuestsServed(paid.stream().mapToInt(bill -> bill.getGuests() == null ? 0 : bill.getGuests()).sum());
        report.setAverageTicket(paid.isEmpty()
            ? BigDecimal.ZERO
            : revenue.divide(BigDecimal.valueOf(paid.size()), 2, RoundingMode.HALF_UP));
        report.setHourly(hourly(paid, zone));
        report.setTopProducts(topProducts(paid));
        report.setCategories(categories(paid));
        return report;
    }

    private BigDecimal sum(List<Bill> bills) {
        return bills.stream().map(Bill::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<DailyReportDTO.HourlySales> hourly(List<Bill> paid, ZoneId zone) {
        Map<Integer, BigDecimal> revenue = new TreeMap<>();
        Map<Integer, Integer> count = new TreeMap<>();

        for (Bill bill : paid) {
            if (bill.getCreatedAt() == null) continue;
            int hour = bill.getCreatedAt().atZoneSameInstant(zone).getHour();
            revenue.merge(hour, bill.getAmount(), BigDecimal::add);
            count.merge(hour, 1, Integer::sum);
        }

        List<DailyReportDTO.HourlySales> result = new ArrayList<>();
        if (revenue.isEmpty()) return result;

        int first = revenue.keySet().iterator().next();
        int last = ((TreeMap<Integer, BigDecimal>) revenue).lastKey();
        for (int hour = first; hour <= last; hour++) {
            result.add(new DailyReportDTO.HourlySales(
                hour,
                revenue.getOrDefault(hour, BigDecimal.ZERO),
                count.getOrDefault(hour, 0)));
        }
        return result;
    }

    private List<DailyReportDTO.ProductSales> topProducts(List<Bill> paid) {
        Map<String, DailyReportDTO.ProductSales> byProduct = new LinkedHashMap<>();

        for (Bill bill : paid) {
            for (BillProduct line : bill.getBillProducts()) {
                BigDecimal lineRevenue = line.getUnitPrice().multiply(BigDecimal.valueOf(line.getQuantity()));
                byProduct.merge(
                    line.getProduct().getName(),
                    new DailyReportDTO.ProductSales(
                        line.getProduct().getName(),
                        line.getProduct().getImageUrl(),
                        line.getQuantity(),
                        lineRevenue),
                    (a, b) -> new DailyReportDTO.ProductSales(
                        a.name(), a.imageUrl(), a.quantity() + b.quantity(), a.revenue().add(b.revenue())));
            }
        }

        return byProduct.values().stream()
            .sorted(Comparator.comparingInt(DailyReportDTO.ProductSales::quantity).reversed())
            .limit(TOP_PRODUCTS)
            .toList();
    }

    private List<DailyReportDTO.CategorySales> categories(List<Bill> paid) {
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();

        for (Bill bill : paid) {
            for (BillProduct line : bill.getBillProducts()) {
                byCategory.merge(
                    line.getProduct().getCategory().getName(),
                    line.getUnitPrice().multiply(BigDecimal.valueOf(line.getQuantity())),
                    BigDecimal::add);
            }
        }

        return byCategory.entrySet().stream()
            .map(entry -> new DailyReportDTO.CategorySales(entry.getKey(), entry.getValue()))
            .sorted(Comparator.comparing(DailyReportDTO.CategorySales::revenue).reversed())
            .toList();
    }
}

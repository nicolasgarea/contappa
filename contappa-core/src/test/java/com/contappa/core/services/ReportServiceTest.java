package com.contappa.core.services;

import com.contappa.core.dto.report.DailyReportDTO;
import com.contappa.core.dto.report.ProductReportDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import com.contappa.core.models.Category;
import com.contappa.core.models.Product;
import com.contappa.core.models.Tables;
import com.contappa.core.repositories.BillProductRepository;
import com.contappa.core.repositories.BillRepository;
import com.contappa.core.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

public class ReportServiceTest {

    private static final ZoneId ZONE = ZoneId.of("Europe/Madrid");
    private static final LocalDate DAY = LocalDate.of(2026, 9, 21);

    private Product product(String name, String category, String price) {
        Category owner = new Category();
        owner.setName(category);
        Product product = new Product();
        product.setName(name);
        product.setPrice(new BigDecimal(price));
        product.setCategory(owner);
        return product;
    }

    private Bill bill(boolean paid, int guests, OffsetDateTime createdAt, Object... lines) {
        Bill bill = new Bill();
        bill.setPaid(paid);
        bill.setGuests(guests);
        bill.setCreatedAt(createdAt);

        List<BillProduct> items = new ArrayList<>();
        BigDecimal amount = BigDecimal.ZERO;
        for (int i = 0; i < lines.length; i += 2) {
            Product product = (Product) lines[i];
            int quantity = (Integer) lines[i + 1];
            BillProduct item = new BillProduct();
            item.setBill(bill);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setUnitPrice(product.getPrice());
            items.add(item);
            amount = amount.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        }
        bill.setBillProducts(items);
        bill.setAmount(amount);
        return bill;
    }

    @Test
    public void testDailyOnlyCountsPaidBillsAsRevenue() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        ReportService reportService = new ReportService(
            billRepository,
            Mockito.mock(BillProductRepository.class),
            Mockito.mock(ProductRepository.class));

        Product latte = product("Latte", "Coffee", "4.00");
        Product burger = product("Burger", "Kitchen", "10.00");

        Bill lunch = bill(true, 2, OffsetDateTime.of(2026, 9, 21, 11, 15, 0, 0, ZoneOffset.UTC), burger, 2, latte, 1);
        Bill coffee = bill(true, 1, OffsetDateTime.of(2026, 9, 21, 11, 45, 0, 0, ZoneOffset.UTC), latte, 3);
        Bill stillOpen = bill(false, 4, OffsetDateTime.of(2026, 9, 21, 12, 5, 0, 0, ZoneOffset.UTC), burger, 1);

        Mockito.when(billRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(any(), any()))
            .thenReturn(List.of(lunch, coffee, stillOpen));

        DailyReportDTO report = reportService.daily(DAY, ZONE);

        assertEquals(new BigDecimal("36.00"), report.getRevenue());
        assertEquals(new BigDecimal("10.00"), report.getOpenAmount());
        assertEquals(2, report.getBillsPaid());
        assertEquals(1, report.getBillsOpen());
        assertEquals(3, report.getGuestsServed());
        assertEquals(new BigDecimal("18.00"), report.getAverageTicket());
    }

    @Test
    public void testDailyBucketsHoursInTheRequestedZone() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        ReportService reportService = new ReportService(
            billRepository,
            Mockito.mock(BillProductRepository.class),
            Mockito.mock(ProductRepository.class));

        Product latte = product("Latte", "Coffee", "4.00");
        Bill early = bill(true, 1, OffsetDateTime.of(2026, 9, 21, 7, 30, 0, 0, ZoneOffset.UTC), latte, 1);
        Bill late = bill(true, 1, OffsetDateTime.of(2026, 9, 21, 9, 10, 0, 0, ZoneOffset.UTC), latte, 2);

        Mockito.when(billRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(any(), any()))
            .thenReturn(List.of(early, late));

        List<DailyReportDTO.HourlySales> hourly = reportService.daily(DAY, ZONE).getHourly();

        assertEquals(3, hourly.size());
        assertEquals(9, hourly.get(0).hour());
        assertEquals(new BigDecimal("4.00"), hourly.get(0).revenue());
        assertEquals(10, hourly.get(1).hour());
        assertEquals(BigDecimal.ZERO, hourly.get(1).revenue());
        assertEquals(11, hourly.get(2).hour());
        assertEquals(new BigDecimal("8.00"), hourly.get(2).revenue());
    }

    @Test
    public void testDailyRanksProductsAndCategories() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        ReportService reportService = new ReportService(
            billRepository,
            Mockito.mock(BillProductRepository.class),
            Mockito.mock(ProductRepository.class));

        Product latte = product("Latte", "Coffee", "4.00");
        Product burger = product("Burger", "Kitchen", "10.00");
        OffsetDateTime noon = OffsetDateTime.of(2026, 9, 21, 10, 0, 0, 0, ZoneOffset.UTC);

        Mockito.when(billRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(any(), any()))
            .thenReturn(List.of(bill(true, 2, noon, latte, 3, burger, 3), bill(true, 1, noon, latte, 2)));

        DailyReportDTO report = reportService.daily(DAY, ZONE);

        assertEquals("Latte", report.getTopProducts().get(0).name());
        assertEquals(5, report.getTopProducts().get(0).quantity());
        assertEquals("Kitchen", report.getCategories().get(0).name());
        assertEquals(new BigDecimal("30.00"), report.getCategories().get(0).revenue());
    }

    @Test
    public void testDailyWithoutBillsIsEmptyNotBroken() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        ReportService reportService = new ReportService(
            billRepository,
            Mockito.mock(BillProductRepository.class),
            Mockito.mock(ProductRepository.class));

        Mockito.when(billRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(any(), any()))
            .thenReturn(List.of());

        DailyReportDTO report = reportService.daily(DAY, ZONE);

        assertEquals(BigDecimal.ZERO, report.getRevenue());
        assertEquals(BigDecimal.ZERO, report.getAverageTicket());
        assertTrue(report.getHourly().isEmpty());
        assertTrue(report.getTopProducts().isEmpty());
    }

    @Test
    public void testProductSeparatesSoldFromOpenUnits() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillProductRepository billProductRepository = Mockito.mock(BillProductRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ReportService reportService = new ReportService(billRepository, billProductRepository, productRepository);

        UUID productId = UUID.randomUUID();
        Product latte = product("Latte", "Coffee", "4.00");
        OffsetDateTime earlier = OffsetDateTime.of(2026, 9, 21, 9, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime later = OffsetDateTime.of(2026, 9, 21, 12, 0, 0, 0, ZoneOffset.UTC);

        Bill settledEarly = bill(true, 1, earlier, latte, 2);
        Bill settledLate = bill(true, 2, later, latte, 3);
        Bill stillOpen = bill(false, 2, later, latte, 1);
        Tables table = new Tables();
        table.setId(UUID.randomUUID());
        stillOpen.setTable(table);

        List<BillProduct> lines = new ArrayList<>();
        lines.addAll(settledEarly.getBillProducts());
        lines.addAll(settledLate.getBillProducts());
        lines.addAll(stillOpen.getBillProducts());

        Mockito.when(productRepository.existsById(productId)).thenReturn(true);
        Mockito.when(billProductRepository.findByProductId(productId)).thenReturn(lines);

        ProductReportDTO report = reportService.product(productId);

        assertEquals(5, report.getUnitsSold());
        assertEquals(new BigDecimal("20.00"), report.getRevenue());
        assertEquals(2, report.getBillsSold());
        assertEquals(later, report.getLastSoldAt());
        assertEquals(1, report.getUnitsOpen());
        assertEquals(1, report.getTablesOpen());
    }

    @Test
    public void testProductUnknownIdIsNotFound() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillProductRepository billProductRepository = Mockito.mock(BillProductRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ReportService reportService = new ReportService(billRepository, billProductRepository, productRepository);

        UUID productId = UUID.randomUUID();
        Mockito.when(productRepository.existsById(productId)).thenReturn(false);

        assertThrows(ProductNotFoundException.class, () -> reportService.product(productId));
    }
}

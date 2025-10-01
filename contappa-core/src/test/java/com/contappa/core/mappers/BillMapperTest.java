package com.contappa.core;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.mappers.BillMapper;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import com.contappa.core.models.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class BillMapperTest {

    private BillMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = Mappers.getMapper(BillMapper.class);
    }

    @Test
    public void testToBillDTO(){
        Product product1 = new Product();
        product1.setId(UUID.randomUUID());
        product1.setPrice(new BigDecimal("10"));

        Product product2 = new Product();
        product2.setId(UUID.randomUUID());
        product2.setPrice(new BigDecimal("20"));

        Bill bill = new Bill();
        bill.setId(UUID.randomUUID());

        BillProduct bp1 = new BillProduct();
        bp1.setProduct(product1);
        bp1.setQuantity(2);
        bp1.setUnitPrice(product1.getPrice());

        BillProduct bp2 = new BillProduct();
        bp2.setProduct(product2);
        bp2.setQuantity(1);
        bp2.setUnitPrice(product2.getPrice());

        bill.setBillProducts(List.of(bp1, bp2));
        bill.setAmount(bp1.getUnitPrice().multiply(BigDecimal.valueOf(bp1.getQuantity()))
            .add(bp2.getUnitPrice().multiply(BigDecimal.valueOf(bp2.getQuantity()))));

        BillDTO billDTO = mapper.toBillDTO(bill);

        assertEquals(new BigDecimal("40"), billDTO.getAmount());
    }
}

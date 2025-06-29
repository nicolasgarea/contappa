package com.contappa.core;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.mappers.BillMapper;
import com.contappa.core.models.Bill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        Bill bill = new Bill();
        bill.setId(UUID.randomUUID());
        bill.setAmount(new BigDecimal("123.34"));
        bill.setDate(LocalDate.of(2025,11,2));
        bill.setStatus("PAID");

        BillDTO billDTO = mapper.toBillDTO(bill);

        assertNotNull(billDTO);
        assertEquals(bill.getId(), billDTO.getId());
        assertEquals(bill.getDate(), billDTO.getDate());
        assertEquals(bill.getAmount(), billDTO.getAmount());
    }
}

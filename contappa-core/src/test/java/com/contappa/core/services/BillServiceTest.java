package com.contappa.core.services;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.exceptions.TableNotFoundException;
import com.contappa.core.mappers.BillMapper;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import com.contappa.core.models.Product;
import com.contappa.core.models.Tables;
import com.contappa.core.repositories.BillRepository;
import com.contappa.core.repositories.ProductRepository;
import com.contappa.core.repositories.TablesRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class BillServiceTest {

    @Test
    public void testCreate(){
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID tableId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        Tables table = new Tables();
        table.setId(tableId);
        Product product = new Product();
        product.setId(productId);
        product.setPrice(BigDecimal.TEN);

        CreateBillRequestDTO.ProductQuantity pq = new CreateBillRequestDTO.ProductQuantity();
        pq.setProductId(productId);
        pq.setQuantity(2);

        CreateBillRequestDTO request = new CreateBillRequestDTO();
        request.setTableId(tableId);
        request.setProducts(List.of(pq));

        Bill savedBill = new Bill();
        savedBill.setAmount(BigDecimal.valueOf(20));

        BillDTO expectedDTO = new BillDTO();

        Mockito.when(tablesRepository.findById(tableId)).thenReturn(Optional.of(table));
        Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        Mockito.when(billRepository.save(Mockito.any(Bill.class))).thenReturn(savedBill);
        Mockito.when(billMapper.toBillDTO(savedBill)).thenReturn(expectedDTO);

        BillDTO result = billService.create(request);

        Assertions.assertEquals(expectedDTO, result);
    }

    @Test
    public void testFindByid(){
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID billId = UUID.randomUUID();
        Bill bill = new Bill();
        Mockito.when(billRepository.findById(billId)).thenReturn(Optional.of(bill));
        bill.setId(billId);
        BillDTO billDTO = new BillDTO();
        billDTO.setId(billId);
        Mockito.when(billMapper.toBillDTO(bill)).thenReturn(billDTO);

        BillDTO result = billService.findById(billId);

        Assertions.assertEquals(billDTO, result);
    }

    @Test
    public void testUpdate(){
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID id = UUID.randomUUID();
        Bill bill = new Bill();
        BillDTO billDTO = new BillDTO();
        Mockito.when(billRepository.save(bill)).thenReturn(bill);
        Mockito.when(billRepository.findById(id)).thenReturn(Optional.of(bill));
        Mockito.when(billMapper.toBill(billDTO)).thenReturn(bill);

        bill.setId(id);

        Bill resultBill = billRepository.save(bill);

        BillDTO expectedDTO = billMapper.toBillDTO(resultBill);

        BillDTO resultDTO = billService.update(id, billDTO);

        Assertions.assertEquals(expectedDTO, resultDTO);
    }

    @Test
    public void testDelete(){
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID id = UUID.randomUUID();
        Bill bill = new Bill();
        bill.setId(id);

        Mockito.when(billRepository.findById(id)).thenReturn(Optional.of(bill));

        billService.delete(id);

        Mockito.verify(billRepository).delete(bill);

    }
}

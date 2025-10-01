package com.contappa.core.services;

import com.contappa.core.dto.bill.BillDTO;
import com.contappa.core.dto.bill.CreateBillRequestDTO;
import com.contappa.core.dto.bill.SplitBillRequestDTO;
import com.contappa.core.dto.bill.UpdateBillRequestDTO;
import com.contappa.core.dto.product.ProductSplitDTO;
import com.contappa.core.dto.product.SplitDTO;
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
import java.time.LocalDate;
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
    public void testUpdate() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID id = UUID.randomUUID();
        Bill bill = new Bill();
        bill.setId(id);

        UpdateBillRequestDTO updateDTO = new UpdateBillRequestDTO();
        updateDTO.setAmount(BigDecimal.valueOf(100));

        UpdateBillRequestDTO.ProductQuantity pq = new UpdateBillRequestDTO.ProductQuantity();
        pq.setProductId(UUID.randomUUID());
        pq.setQuantity(2);
        updateDTO.setProducts(List.of(pq));

        Product mockProduct = new Product();
        mockProduct.setId(pq.getProductId());
        mockProduct.setPrice(BigDecimal.valueOf(50));

        BillDTO expectedDTO = new BillDTO();

        Mockito.when(billRepository.findById(id)).thenReturn(Optional.of(bill));
        Mockito.when(billRepository.save(bill)).thenReturn(bill);
        Mockito.when(productRepository.findById(pq.getProductId()))
            .thenReturn(Optional.of(mockProduct));;
        Mockito.when(billMapper.toBillDTO(bill)).thenReturn(expectedDTO);

        BillDTO resultDTO = billService.update(id, updateDTO);

        Assertions.assertEquals(expectedDTO, resultDTO);
    }

    @Test
    public void testSplitBill() {
        BillRepository billRepository = Mockito.mock(BillRepository.class);
        BillMapper billMapper = Mockito.mock(BillMapper.class);
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        BillService billService = new BillService(billRepository, tablesRepository, productRepository, billMapper);

        UUID billId = UUID.randomUUID();
        UUID productId1 = UUID.randomUUID();
        UUID productId2 = UUID.randomUUID();

        Product product1 = new Product();
        product1.setId(productId1);
        product1.setPrice(BigDecimal.TEN);

        Product product2 = new Product();
        product2.setId(productId2);
        product2.setPrice(BigDecimal.valueOf(5));

        BillProduct bp1 = new BillProduct();
        bp1.setProduct(product1);
        bp1.setQuantity(2);
        bp1.setUnitPrice(product1.getPrice());

        BillProduct bp2 = new BillProduct();
        bp2.setProduct(product2);
        bp2.setQuantity(1);
        bp2.setUnitPrice(product2.getPrice());

        Bill originalBill = new Bill();
        originalBill.setId(billId);
        originalBill.setBillProducts(List.of(bp1, bp2));
        originalBill.setTable(new Tables());

        SplitBillRequestDTO splitRequest = new SplitBillRequestDTO(List.of(
            new SplitDTO(List.of(
                new ProductSplitDTO(productId1, 1),
                new ProductSplitDTO(productId2, 1)
            )),
            new SplitDTO(List.of(
                new ProductSplitDTO(productId1, 1)
            ))
        ));

        Bill savedBill1 = new Bill();
        Bill savedBill2 = new Bill();
        BillDTO dto1 = new BillDTO();
        BillDTO dto2 = new BillDTO();

        Mockito.when(billRepository.findById(billId)).thenReturn(Optional.of(originalBill));
        Mockito.when(billRepository.save(Mockito.any(Bill.class)))
            .thenReturn(savedBill1)
            .thenReturn(savedBill2);
        Mockito.when(billMapper.toBillDTO(savedBill1)).thenReturn(dto1);
        Mockito.when(billMapper.toBillDTO(savedBill2)).thenReturn(dto2);

        List<BillDTO> result = billService.splitBill(billId, splitRequest);

        Assertions.assertEquals(2, result.size());
        Assertions.assertTrue(result.contains(dto1));
        Assertions.assertTrue(result.contains(dto2));
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

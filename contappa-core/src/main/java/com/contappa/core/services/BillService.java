package com.contappa.core.services;


import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.exceptions.BillNotFoundException;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BillService {
    private final BillRepository billRepository;
    private final TablesRepository tablesRepository;
    private final ProductRepository productRepository;
    private final BillMapper billMapper;

    @Autowired
    public BillService(BillRepository billRepository, TablesRepository tablesRepository, ProductRepository productRepository, BillMapper billMapper){
        this.billRepository = billRepository;
        this.tablesRepository = tablesRepository;
        this.productRepository = productRepository;
        this.billMapper = billMapper;
    }

    public BillDTO create(CreateBillRequestDTO request){
        Tables table = tablesRepository.findById(request.getTableId()).orElseThrow(() -> new TableNotFoundException("Table not found."));
        List<BillProduct> billProducts = new ArrayList<>();
        List<CreateBillRequestDTO.ProductQuantity> productsList =  request.getProducts();
        BigDecimal amount = BigDecimal.ZERO;
        Bill bill = new Bill();
        bill.setTable(table);
        for (CreateBillRequestDTO.ProductQuantity productQuantity : productsList) {
            Product product = productRepository.findById(productQuantity.getProductId()).orElseThrow(() -> new ProductNotFoundException("Product not found."));
            BillProduct billProduct = new BillProduct();
            billProduct.setProduct(product);
            billProduct.setQuantity(productQuantity.getQuantity());
            billProduct.setBill(bill);
            billProduct.setUnitPrice(product.getPrice());
            billProducts.add(billProduct);
            amount = amount.add(product.getPrice().multiply(BigDecimal.valueOf(productQuantity.getQuantity())));
        }
        bill.setAmount(amount);
        bill.setBillProducts(billProducts);
        bill.setCreatedAt(LocalDateTime.now());
        Bill billSaved = billRepository.save(bill);
        return billMapper.toBillDTO(billSaved);
    }

    public BillDTO findById(UUID id){
        Bill bill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        return billMapper.toBillDTO(bill);
    }

    public BillDTO update(UUID id, BillDTO billDTO){
        Bill existingBill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        Bill updatedBill = billMapper.toBill(billDTO);
        updatedBill.setId(id);
        Bill savedBill = billRepository.save(updatedBill);
        return billMapper.toBillDTO(savedBill);
    }

    public void delete(UUID id){
        Bill bill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        billRepository.delete(bill);
    }
}

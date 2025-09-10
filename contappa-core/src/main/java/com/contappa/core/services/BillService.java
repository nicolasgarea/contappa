package com.contappa.core.services;


import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.dto.UpdateBillRequestDTO;
import com.contappa.core.dto.SplitDTO;
import com.contappa.core.dto.SplitBillRequestDTO;
import com.contappa.core.dto.ProductSplitDTO;
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

    public BillDTO update(UUID id, UpdateBillRequestDTO billDTO){
        Bill existingBill = billRepository.findById(id)
            .orElseThrow(() -> new BillNotFoundException("Bill not found."));

        existingBill.setAmount(billDTO.getAmount());
        existingBill.setDate(billDTO.getDate());

        if (billDTO.getTableId() != null) {
            Tables table = tablesRepository.findById(billDTO.getTableId())
                .orElseThrow(() -> new TableNotFoundException("Table not found."));
            existingBill.setTable(table);
        }

        if (billDTO.getProducts() != null) {
            existingBill.getBillProducts().clear();
            for (UpdateBillRequestDTO.ProductQuantity pq : billDTO.getProducts()) {
                Product product = productRepository.findById(pq.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found."));
                BillProduct bp = new BillProduct();
                bp.setBill(existingBill);
                bp.setProduct(product);
                bp.setQuantity(pq.getQuantity());
                bp.setUnitPrice(product.getPrice());
                existingBill.getBillProducts().add(bp);
            }
        }

        return billMapper.toBillDTO(billRepository.save(existingBill));
    }

    public List<BillDTO> splitBill(UUID billId, SplitBillRequestDTO request) {
        Bill originalBill = billRepository.findById(billId)
            .orElseThrow(() -> new BillNotFoundException("Bill not found."));

        List<BillDTO> splitBills = new ArrayList<>();

        for (SplitDTO split : request.getSplits()) {
            Bill newBill = new Bill();
            newBill.setTable(originalBill.getTable());

            BigDecimal amount = BigDecimal.ZERO;
            List<BillProduct> splitProducts = new ArrayList<>();

            for (ProductSplitDTO ps : split.getProducts()) {
                BillProduct originalProduct = originalBill.getBillProducts().stream()
                    .filter(bp -> bp.getProduct().getId().equals(ps.getProductId()))
                    .findFirst()
                    .orElseThrow(() -> new ProductNotFoundException("Product not found in bill"));

                BillProduct bp = new BillProduct();
                bp.setBill(newBill);
                bp.setProduct(originalProduct.getProduct());
                bp.setQuantity(ps.getQuantity());
                bp.setUnitPrice(originalProduct.getUnitPrice());

                splitProducts.add(bp);
                amount = amount.add(bp.getUnitPrice().multiply(BigDecimal.valueOf(bp.getQuantity())));
            }

            newBill.setBillProducts(splitProducts);
            newBill.setAmount(amount);
            newBill.setCreatedAt(LocalDateTime.now());

            Bill savedBill = billRepository.save(newBill);
            splitBills.add(billMapper.toBillDTO(savedBill));
        }

        return splitBills;
    }

    public void delete(UUID id){
        Bill bill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        billRepository.delete(bill);
    }
}

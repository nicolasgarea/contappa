package com.contappa.core.services;


import com.contappa.core.dto.bill.BillDTO;
import com.contappa.core.dto.bill.CreateBillRequestDTO;
import com.contappa.core.dto.bill.UpdateBillRequestDTO;
import com.contappa.core.dto.product.SplitDTO;
import com.contappa.core.dto.bill.SplitBillRequestDTO;
import com.contappa.core.dto.product.ProductSplitDTO;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Transactional
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
        bill.setDate(LocalDate.now());
        Bill billSaved = billRepository.save(bill);
        return billMapper.toBillDTO(billSaved);
    }

    public List<BillDTO> findByTableId(UUID tableId) {
        List<Bill> bills = billRepository.findByTableId(tableId);
        List<BillDTO> billDTOs = new ArrayList<>();
        for (Bill bill : bills) {
            billDTOs.add(billMapper.toBillDTO(bill));
        }
        return billDTOs;
    }

    public BillDTO findById(UUID id){
        Bill bill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        return billMapper.toBillDTO(bill);
    }

    @Transactional
    public BillDTO update(UUID id, UpdateBillRequestDTO billDTO) {
        Bill existingBill = billRepository.findById(id)
            .orElseThrow(() -> new BillNotFoundException("Bill not found."));

        existingBill.setDate(billDTO.getDate());

        if (billDTO.getTableId() != null) {
            Tables table = tablesRepository.findById(billDTO.getTableId())
                .orElseThrow(() -> new TableNotFoundException("Table not found."));
            existingBill.setTable(table);
        }

        if (billDTO.getProducts() != null) {
            existingBill.getBillProducts().clear();
            BigDecimal newAmount = BigDecimal.ZERO;

            for (UpdateBillRequestDTO.ProductQuantity pq : billDTO.getProducts()) {
                Product product = productRepository.findById(pq.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found."));

                if (pq.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Quantity must be greater than zero.");
                }

                BillProduct bp = new BillProduct();
                bp.setBill(existingBill);
                bp.setProduct(product);
                bp.setQuantity(pq.getQuantity());
                bp.setUnitPrice(product.getPrice());

                existingBill.getBillProducts().add(bp);

                newAmount = newAmount.add(product.getPrice().multiply(BigDecimal.valueOf(pq.getQuantity())));
            }
            existingBill.setAmount(newAmount);
        } else if (billDTO.getAmount() != null) {
            existingBill.setAmount(billDTO.getAmount());
        }

        if (billDTO.getPaid() != null) {
            existingBill.setPaid(billDTO.getPaid());
        }

        return billMapper.toBillDTO(billRepository.save(existingBill));
    }

    @Transactional
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
            newBill.setDate(LocalDate.now());
            newBill.setPaid(false);

            Bill savedBill = billRepository.save(newBill);
            splitBills.add(billMapper.toBillDTO(savedBill));
        }

        return splitBills;
    }

    @Transactional
    public BillDTO markAsPaid(UUID id) {
        Bill bill = billRepository.findById(id)
            .orElseThrow(() -> new BillNotFoundException("Bill not found."));
        bill.setPaid(true);
        bill.setUpdatedAt(LocalDateTime.now());
        return billMapper.toBillDTO(billRepository.save(bill));
    }

    @Transactional
    public void delete(UUID id){
        Bill bill = billRepository.findById(id).orElseThrow(() -> new BillNotFoundException("Bill not found."));
        billRepository.delete(bill);
    }
}

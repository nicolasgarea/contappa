package com.contappa.core.mappers;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import com.contappa.core.models.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface BillMapper {

    @Mapping(source = "table.id", target = "tableId")
    @Mapping(source = "billProducts", target = "products")
    BillDTO toBillDTO(Bill bill);

    default List<BillDTO.ProductQuantity> mapBillProducts(List<BillProduct> billProducts) {
        if (billProducts == null) return null;
        return billProducts.stream()
            .map(bp -> {
                BillDTO.ProductQuantity pq = new BillDTO.ProductQuantity();
                pq.setProductId(bp.getProduct().getId().toString());
                pq.setQuantity(bp.getQuantity());
                return pq;
            })
            .toList();
    }

    default Bill toBill(BillDTO billDTO) {
        if (billDTO == null) return null;
        Bill bill = new Bill();
        bill.setId(billDTO.getId());
        bill.setAmount(billDTO.getAmount());
        bill.setDate(billDTO.getDate());
        if (billDTO.getTableId() != null) {
            bill.setTable(new com.contappa.core.models.Tables());
            bill.getTable().setId(billDTO.getTableId());
        }
        if (billDTO.getProducts() != null) {
            List<BillProduct> billProducts = billDTO.getProducts().stream().map(pq -> {
                BillProduct bp = new BillProduct();
                Product product = new Product();
                product.setId(UUID.fromString(pq.getProductId()));
                bp.setProduct(product);
                bp.setQuantity(pq.getQuantity());
                bp.setBill(bill);
                return bp;
            }).toList();
            bill.setBillProducts(billProducts);
        }
        return bill;
    }

    default Bill toBill(CreateBillRequestDTO createBillRequestDTO) {
        if (createBillRequestDTO == null) return null;
        Bill bill = new Bill();
        bill.setAmount(createBillRequestDTO.getAmount());
        bill.setDate(createBillRequestDTO.getDate());
        if (createBillRequestDTO.getTableId() != null) {
            bill.setTable(new com.contappa.core.models.Tables());
            bill.getTable().setId(createBillRequestDTO.getTableId());
        }
        if (createBillRequestDTO.getProducts() != null) {
            List<BillProduct> billProducts = createBillRequestDTO.getProducts().stream().map(pq -> {
                BillProduct bp = new BillProduct();
                Product product = new Product();
                product.setId(pq.getProductId());
                bp.setProduct(product);
                bp.setQuantity(pq.getQuantity());
                bp.setBill(bill);
                return bp;
            }).toList();
            bill.setBillProducts(billProducts);
        }
        return bill;
    }
}

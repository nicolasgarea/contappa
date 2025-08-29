package com.contappa.core.mappers;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.models.Bill;
import com.contappa.core.models.BillProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

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

    Bill toBill(BillDTO billDTO);

    Bill toBill(CreateBillRequestDTO createBillRequestDTO);
}

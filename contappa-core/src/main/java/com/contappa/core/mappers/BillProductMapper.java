package com.contappa.core.mappers;

import com.contappa.core.dto.BillProductDTO;
import com.contappa.core.models.BillProduct;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillProductMapper {
    BillProduct toBillProduct(BillProductDTO billProductDTO);

    BillProductDTO toBillProductDTO(BillProduct billProduct);
}

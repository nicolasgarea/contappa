package com.contappa.core.mappers;

import com.contappa.core.dto.ProductDTO;
import com.contappa.core.models.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDTO toProductDTO(Product product);

    Product toProduct(ProductDTO productDTO);
}

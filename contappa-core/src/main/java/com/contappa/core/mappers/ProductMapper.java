package com.contappa.core.mappers;


import com.contappa.core.dto.product.CreateProductRequestDTO;
import com.contappa.core.dto.product.ProductDTO;
import com.contappa.core.dto.product.UpdateProductRequestDTO;
import com.contappa.core.models.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toProductDTO(Product product);

    @Mapping(target = "category", expression = "java(dto.getCategoryId() != null ? new Category(dto.getCategoryId()) : null)")
    Product toProduct(CreateProductRequestDTO dto);

    @Mapping(target = "category", expression = "java(dto.getCategoryId() != null ? new Category(dto.getCategoryId()) : null)")
    Product toProduct(UpdateProductRequestDTO dto);

    @Mapping(target = "category", expression = "java(productDTO.getCategoryId() != null ? new Category(productDTO.getCategoryId()) : null)")
    Product toProduct(ProductDTO productDTO);
}

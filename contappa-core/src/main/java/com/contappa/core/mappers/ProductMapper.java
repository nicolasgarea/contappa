package com.contappa.core.mappers;

import com.contappa.core.dto.CreateProductRequestDTO;
import com.contappa.core.dto.ProductDTO;
import com.contappa.core.dto.UpdateProductRequestDTO;
import com.contappa.core.models.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source="categoryId", target="category.id")
    @Mapping(source="imageUrl", target="imageUrl")
    ProductDTO toProductDTO(Product product);

    Product toProduct(ProductDTO productDTO);

    @Mapping(source="categoryId", target="category.id")
    Product toProduct(CreateProductRequestDTO createProductDTO);

    @Mapping(source="categoryId", target="category.id")
    Product toProduct(UpdateProductRequestDTO updateProductDTO);
}

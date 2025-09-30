package com.contappa.core.mappers;

import com.contappa.core.dto.CreateProductRequestDTO;
import com.contappa.core.dto.ProductDTO;
import com.contappa.core.dto.UpdateProductRequestDTO;
import com.contappa.core.models.Category;
import com.contappa.core.models.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toProductDTO(Product product);

    @Mapping(target = "category", ignore = true)
    Product toProduct(ProductDTO productDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", expression = "java(dto.getCategoryId() != null ? new Category(dto.getCategoryId()) : null)")
    Product toProduct(CreateProductRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", expression = "java(dto.getCategoryId() != null ? new Category(dto.getCategoryId()) : null)")
    Product toProduct(UpdateProductRequestDTO dto);

    @Named("uuidToCategory")
    default Category map(UUID categoryId) {
        if (categoryId == null) {
            return null;
        }
        return new Category(categoryId);
    }
}


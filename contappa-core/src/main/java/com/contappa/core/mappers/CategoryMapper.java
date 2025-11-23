package com.contappa.core.mappers;

import com.contappa.core.dto.category.CategoryDTO;
import com.contappa.core.dto.category.CreateCategoryRequestDTO;
import com.contappa.core.dto.category.UpdateCategoryRequestDTO;
import com.contappa.core.models.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toCategoryDTO(Category category);

    Category toCategory(CategoryDTO categoryDTO);

    @Mapping(target = "id", ignore = true)
    Category toCategory(CreateCategoryRequestDTO createCategoryRequestDTO);

    @Mapping(target = "id", ignore = true)
    Category toCategory(UpdateCategoryRequestDTO updateCategoryRequestDTO);
}


package com.contappa.core.mappers;

import com.contappa.core.dto.CategoryDTO;
import com.contappa.core.dto.CreateCategoryRequestDTO;
import com.contappa.core.dto.UpdateCategoryRequestDTO;
import com.contappa.core.models.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toCategoryDTO(Category category);

    Category toCategory(CategoryDTO categoryDTO);

    Category toCategory(CreateCategoryRequestDTO createCategoryRequestDTO);

    Category toCategory(UpdateCategoryRequestDTO updateCategoryRequestDTO);
}


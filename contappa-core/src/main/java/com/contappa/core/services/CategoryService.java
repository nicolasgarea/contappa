package com.contappa.core.services;

import com.contappa.core.dto.category.CategoryDTO;
import com.contappa.core.dto.category.CreateCategoryRequestDTO;
import com.contappa.core.dto.category.UpdateCategoryRequestDTO;
import com.contappa.core.exceptions.CategoryNotFoundException;
import com.contappa.core.mappers.CategoryMapper;
import com.contappa.core.models.Category;
import com.contappa.core.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public CategoryDTO create(CreateCategoryRequestDTO dto) {
        Category category = categoryMapper.toCategory(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toCategoryDTO(saved);
    }

    public CategoryDTO findById(UUID id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        return categoryMapper.toCategoryDTO(category);
    }

    public List<CategoryDTO> listAll() {
        return categoryRepository.findAll().stream()
            .map(categoryMapper::toCategoryDTO)
            .collect(Collectors.toList());
    }

    public CategoryDTO update(UUID id, UpdateCategoryRequestDTO dto) {
        Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());

        Category saved = categoryRepository.save(existing);
        return categoryMapper.toCategoryDTO(saved);
    }

    public void delete(UUID id) {
        Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(existing);
    }
}

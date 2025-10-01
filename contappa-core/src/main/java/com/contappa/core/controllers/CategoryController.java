package com.contappa.core.controllers;
import com.contappa.core.dto.CategoryDTO;
import com.contappa.core.dto.CreateCategoryRequestDTO;
import com.contappa.core.dto.UpdateCategoryRequestDTO;
import com.contappa.core.services.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CreateCategoryRequestDTO dto){
        CategoryDTO created = categoryService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable UUID id){
        CategoryDTO category = categoryService.findById(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> listAllCategories(){
        List<CategoryDTO> categories = categoryService.listAll();
        return ResponseEntity.ok(categories);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable UUID id, @RequestBody UpdateCategoryRequestDTO dto){
        CategoryDTO updated = categoryService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id){
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.contappa.core.controllers;


import com.contappa.core.dto.product.CreateProductRequestDTO;
import com.contappa.core.dto.product.ProductDTO;
import com.contappa.core.dto.product.UpdateProductRequestDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/categories/{categoryId}/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@PathVariable UUID categoryId, @Valid @RequestBody CreateProductRequestDTO productDTO){
        productDTO.setCategoryId(categoryId);
        ProductDTO product = productService.create(productDTO);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable UUID categoryId, @PathVariable UUID id){
        ProductDTO productDTO = productService.findById(id);
        if (!productDTO.getCategoryId().equals(categoryId)) {
            throw new ProductNotFoundException("Product not found in this category.");
        }
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> listAllProducts(@PathVariable UUID categoryId){
        List<ProductDTO> products = productService.listAllProducts().stream()
            .filter(p -> categoryId.equals(p.getCategoryId()))
            .toList();
        return ResponseEntity.ok(products);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID categoryId, @PathVariable UUID id, @Valid @RequestBody UpdateProductRequestDTO productDTO){
        ProductDTO existing = productService.findById(id);
        if (!existing.getCategoryId().equals(categoryId)) {
            throw new ProductNotFoundException("Product not found in this category.");
        }
        ProductDTO updated = productService.update(id, productDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID categoryId, @PathVariable UUID id){
        ProductDTO existing = productService.findById(id);
        if (!Objects.equals(existing.getCategoryId(), categoryId)) {
            throw new ProductNotFoundException("Product not found in this category.");
        }
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

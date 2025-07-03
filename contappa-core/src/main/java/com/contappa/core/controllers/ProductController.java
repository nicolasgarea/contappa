package com.contappa.core.controllers;

import com.contappa.core.dto.ProductDTO;
import com.contappa.core.dto.TablesDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.models.Product;
import com.contappa.core.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO){
        ProductDTO product = productService.create(productDTO);
        URI location = URI.create("/products/" + product.getId());
        return ResponseEntity.created(location).body(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable UUID id){
        ProductDTO productDTO = productService.findById(id);
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> listAllProducts(){
        List<ProductDTO> products = productService.listAllProducts();
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID id, @RequestBody ProductDTO productDTO){
        ProductDTO updated = productService.update(id, productDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id){
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

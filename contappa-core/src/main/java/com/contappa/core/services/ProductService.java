package com.contappa.core.services;

import com.contappa.core.dto.CreateProductRequestDTO;
import com.contappa.core.dto.ProductDTO;
import com.contappa.core.dto.UpdateProductRequestDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.mappers.ProductMapper;
import com.contappa.core.models.Product;
import com.contappa.core.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Autowired
    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public ProductDTO create(CreateProductRequestDTO productDTO){
        Product product = productMapper.toProduct(productDTO);
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductDTO(savedProduct);
    }

    public ProductDTO findById(UUID id){
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found with id " + id));
        return productMapper.toProductDTO(product);
    }

    public List<ProductDTO> listAllProducts(){
        return productRepository.findAll().stream().map(productMapper::toProductDTO).collect(Collectors.toList());
    }

    public ProductDTO update(UUID id, UpdateProductRequestDTO productDTO) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        Product updatedProduct = productMapper.toProduct(productDTO);
        updatedProduct.setId(existingProduct.getId());

        Product savedProduct = productRepository.save(updatedProduct);
        return productMapper.toProductDTO(savedProduct);
    }


    public void delete(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }
}

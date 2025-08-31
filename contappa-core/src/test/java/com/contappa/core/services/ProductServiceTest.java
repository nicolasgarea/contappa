package com.contappa.core.services;

import com.contappa.core.dto.CreateProductRequestDTO;
import com.contappa.core.dto.ProductDTO;
import com.contappa.core.dto.UpdateProductRequestDTO;
import com.contappa.core.exceptions.ProductNotFoundException;
import com.contappa.core.mappers.ProductMapper;
import com.contappa.core.models.Product;
import com.contappa.core.repositories.ProductRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Test
    public void testCreate(){
        ProductMapper productMapper = Mockito.mock(ProductMapper.class);
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ProductService productService = new ProductService(productRepository, productMapper);

        CreateProductRequestDTO createDTO = new CreateProductRequestDTO();
        createDTO.setName("productName");
        createDTO.setPrice(BigDecimal.valueOf(100));

        Product product = new Product();
        Product savedProduct = new Product();
        ProductDTO outputDTO = new ProductDTO();

        Mockito.when(productMapper.toProduct(createDTO)).thenReturn(product);
        Mockito.when(productRepository.save(product)).thenReturn(savedProduct);
        Mockito.when(productMapper.toProductDTO(savedProduct)).thenReturn(outputDTO);

        ProductDTO result = productService.create(createDTO);

        Assertions.assertEquals(outputDTO, result);
    }


    @Test
    public void testFindById(){
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ProductMapper productMapper = Mockito.mock(ProductMapper.class);
        ProductService productService = new ProductService(productRepository, productMapper);

        String idString = "123e4567-e89b-12d3-a456-426614174000";
        UUID id = UUID.fromString(idString);

        Product product = Mockito.mock(Product.class);
        ProductDTO productDTO = new ProductDTO();
        Mockito.when(productRepository.findById(id)).thenReturn(Optional.of(product));
        Mockito.when(productMapper.toProductDTO(product)).thenReturn(productDTO);

        ProductDTO outputDTO = productService.findById(id);
        Assertions.assertEquals(outputDTO, productDTO);
    }


    @Test
    public void testListAllProducts(){
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ProductMapper productMapper = Mockito.mock(ProductMapper.class);
        ProductService productService = new ProductService(productRepository, productMapper);

        Product product = Mockito.mock(Product.class);
        ProductDTO productDTO = new ProductDTO();

        List<Product> list = new ArrayList<>();
        list.add(product);
        Mockito.when(productRepository.findAll()).thenReturn(list);
        Mockito.when(productMapper.toProductDTO(product)).thenReturn(productDTO);

        List<ProductDTO> result = productService.listAllProducts();

        Assertions.assertEquals(productDTO, result.get(0));
    }



    @Test
    public void testUpdate(){
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ProductMapper productMapper = Mockito.mock(ProductMapper.class);
        ProductService productService = new ProductService(productRepository, productMapper);

        UUID id = UUID.randomUUID();
        UpdateProductRequestDTO updateDTO = new UpdateProductRequestDTO();
        updateDTO.setName("updatedProductName");
        updateDTO.setPrice(BigDecimal.valueOf(150));

        Product existingProduct = new Product();
        existingProduct.setId(id);

        Product updatedProduct = new Product();
        updatedProduct.setId(id);
        updatedProduct.setName(updateDTO.getName());
        updatedProduct.setPrice(updateDTO.getPrice());

        ProductDTO returnedDTO = new ProductDTO();
        returnedDTO.setId(id);

        Mockito.when(productRepository.findById(id)).thenReturn(Optional.of(existingProduct));
        Mockito.when(productMapper.toProduct(updateDTO)).thenReturn(updatedProduct);
        Mockito.when(productRepository.save(updatedProduct)).thenReturn(updatedProduct);
        Mockito.when(productMapper.toProductDTO(updatedProduct)).thenReturn(returnedDTO);

        ProductDTO result = productService.update(id, updateDTO);

        Assertions.assertEquals(id, result.getId());
    }

    @Test
    public void testDelete(){
        ProductRepository productRepository = Mockito.mock(ProductRepository.class);
        ProductMapper productMapper = Mockito.mock(ProductMapper.class);
        ProductService productService = new ProductService(productRepository, productMapper);

        UUID id = UUID.randomUUID();
        Product product = new Product();

        Mockito.when(productRepository.findById(id)).thenReturn(Optional.of(product));

        productService.delete(id);
        Mockito.verify(productRepository).delete(product);

    }
}

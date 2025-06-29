package com.contappa.core;

import com.contappa.core.dto.ProductDTO;
import com.contappa.core.mappers.ProductMapper;
import com.contappa.core.models.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ProductMapperTest {

    private ProductMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = Mappers.getMapper(ProductMapper.class);
    }

    @Test
    public void testToProductDTO(){
        Product product = new Product();
        UUID id = UUID.randomUUID();
        product.setId(id);
        product.setName("product");
        product.setPrice(new BigDecimal("10.5"));

        ProductDTO productDTO = mapper.toProductDTO(product);

        assertNotNull(productDTO);
        assertEquals(productDTO.getId(), product.getId());
        assertEquals(productDTO.getName(), product.getName());
        assertEquals(productDTO.getPrice(), product.getPrice());
    }

    @Test
    public void testToProduct(){
        ProductDTO productDTO = new ProductDTO();
        UUID id = UUID.randomUUID();
        productDTO.setId(id);
        productDTO.setName("productDTO");
        productDTO.setPrice(new BigDecimal("12.5"));

        Product product = mapper.toProduct(productDTO);

        assertNotNull(product);
        assertEquals(product.getId(),productDTO.getId());
        assertEquals(product.getName(), productDTO.getName());
        assertEquals(product.getPrice(), productDTO.getPrice());

    }
}

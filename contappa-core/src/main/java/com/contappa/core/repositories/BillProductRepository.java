package com.contappa.core.repositories;

import com.contappa.core.models.BillProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BillProductRepository extends JpaRepository<BillProduct, UUID> {
}

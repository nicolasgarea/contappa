package com.contappa.core.repositories;

import com.contappa.core.models.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BillRepository extends JpaRepository<Bill, UUID> {
}

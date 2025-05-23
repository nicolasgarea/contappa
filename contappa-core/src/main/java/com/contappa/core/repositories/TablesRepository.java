package com.contappa.core.repositories;
import com.contappa.core.models.Tables;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface TablesRepository extends JpaRepository<Tables, UUID> {
}

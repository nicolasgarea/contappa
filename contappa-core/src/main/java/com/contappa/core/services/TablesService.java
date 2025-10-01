package com.contappa.core.services;

import com.contappa.core.dto.table.CreateTableRequestDTO;
import com.contappa.core.dto.table.TablesDTO;
import com.contappa.core.dto.table.UpdateTableRequestDTO;
import com.contappa.core.exceptions.TableNotFoundException;
import com.contappa.core.mappers.TablesMapper;
import com.contappa.core.models.Tables;
import com.contappa.core.repositories.TablesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TablesService {

    private final TablesRepository tablesRepository;
    private final TablesMapper tablesMapper;

    public TablesService(TablesRepository tablesRepository, TablesMapper tablesMapper) {
        this.tablesRepository = tablesRepository;
        this.tablesMapper = tablesMapper;
    }

    public TablesDTO create(CreateTableRequestDTO dto) {
        Tables table = tablesMapper.toTables(dto);
        Tables saved = tablesRepository.save(table);
        return tablesMapper.toTablesDTO(saved);
    }

    public TablesDTO findById(UUID id) {
        Tables table = tablesRepository.findById(id).orElseThrow(() -> new TableNotFoundException("Table not found with id: " + id));
        return tablesMapper.toTablesDTO(table);
    }

    public List<TablesDTO> listAll() {
        return tablesRepository.findAll().stream().map(tablesMapper::toTablesDTO).collect(Collectors.toList());
    }

    public TablesDTO update(UUID id, UpdateTableRequestDTO dto) {
        Tables existing = tablesRepository.findById(id).orElseThrow(() -> new TableNotFoundException("Table not found with id: " + id));

        existing.setNumber(dto.getNumber());
        Tables saved = tablesRepository.save(existing);
        return tablesMapper.toTablesDTO(saved);
    }

    public void delete(UUID id) {
        Tables existing = tablesRepository.findById(id).orElseThrow(() -> new TableNotFoundException("Table not found with id: " + id));
        tablesRepository.delete(existing);
    }
}

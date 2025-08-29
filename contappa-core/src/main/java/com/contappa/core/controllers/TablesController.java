package com.contappa.core.controllers;

import com.contappa.core.dto.CreateTableRequestDTO;
import com.contappa.core.dto.TablesDTO;
import com.contappa.core.dto.UpdateTableRequestDTO;
import com.contappa.core.services.TablesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tables")
public class TablesController {

    private final TablesService tablesService;

    public TablesController(TablesService tablesService){
        this.tablesService = tablesService;
    }

    @PostMapping
    public ResponseEntity<TablesDTO> createTable(@RequestBody CreateTableRequestDTO dto){
        TablesDTO created = tablesService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TablesDTO> getTableById(@PathVariable UUID id) {
        TablesDTO table = tablesService.findById(id);
        return ResponseEntity.ok(table);
    }

    @GetMapping
    public ResponseEntity<List<TablesDTO>> listAllTables() {
        List<TablesDTO> tables = tablesService.listAll();
        return ResponseEntity.ok(tables);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TablesDTO> updateTable(@PathVariable UUID id, @RequestBody UpdateTableRequestDTO dto) {
        TablesDTO updated = tablesService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable UUID id) {
        tablesService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

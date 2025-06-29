package com.contappa.core.services;


import com.contappa.core.dto.TablesDTO;
import com.contappa.core.exceptions.TableNotFoundException;
import com.contappa.core.mappers.TablesMapper;
import com.contappa.core.models.Tables;
import com.contappa.core.repositories.ProductRepository;
import com.contappa.core.repositories.TablesRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ExtendWith(MockitoExtension.class)
public class TablesServiceTest {



    @Test
    public void create(){
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        TablesMapper tablesMapper = Mockito.mock(TablesMapper.class);
        TablesService tablesService = new TablesService(tablesRepository, tablesMapper);

        Tables table = new Tables();
        TablesDTO tableDTO = new TablesDTO();

        Mockito.when(tablesMapper.toTables(tableDTO)).thenReturn(table);
        Mockito.when(tablesRepository.save(table)).thenReturn(table);
        Mockito.when(tablesMapper.toTablesDTO(table)).thenReturn(tableDTO);

        TablesDTO result = tablesService.create(tableDTO);

        Assertions.assertEquals(tableDTO, result);
    }

    @Test
    public void testFindById(){
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        TablesMapper tablesMapper = Mockito.mock(TablesMapper.class);
        TablesService tablesService = new TablesService(tablesRepository, tablesMapper);

        UUID id = UUID.randomUUID();
        Tables table = new Tables();
        TablesDTO tableDTO = new TablesDTO();
        tableDTO.setId(id);

        Mockito.when(tablesRepository.findById(id)).thenReturn(Optional.of(table));
        Mockito.when(tablesMapper.toTablesDTO(table)).thenReturn(tableDTO);

        TablesDTO result = tablesService.findById(id);

        Assertions.assertEquals(id, result.getId());

    }

    @Test
    public void testListAll(){
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        TablesMapper tablesMapper = Mockito.mock(TablesMapper.class);
        TablesService tablesService = new TablesService(tablesRepository, tablesMapper);

        Tables table = new Tables();
        TablesDTO tableDTO = new TablesDTO();

        List<Tables> list = new ArrayList<>();
        list.add(table);

        Mockito.when(tablesRepository.findAll()).thenReturn(list);
        Mockito.when(tablesMapper.toTablesDTO(table)).thenReturn(tableDTO);

        List<TablesDTO> result = tablesService.listAll();

        Assertions.assertEquals(result.get(0), tableDTO);
    }

    @Test
    public void testUpdate(){
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        TablesMapper tablesMapper = Mockito.mock(TablesMapper.class);
        TablesService tablesService = new TablesService(tablesRepository, tablesMapper);

        UUID id = UUID.randomUUID();
        TablesDTO tableDTO = new TablesDTO();
        Tables table = new Tables();
        table.setId(id);
        tableDTO.setId(id);
        Tables tableSaved = new Tables();
        Mockito.when(tablesRepository.findById(id)).thenReturn(Optional.of(table));
        Mockito.when(tablesRepository.save(table)).thenReturn(tableSaved);
        Mockito.when(tablesMapper.toTablesDTO(tableSaved)).thenReturn(tableDTO);

        TablesDTO result = tablesService.update(id, tableDTO);

        Assertions.assertEquals(tableDTO, result);
    }
    
    @Test
    public void testDelete(){
        TablesRepository tablesRepository = Mockito.mock(TablesRepository.class);
        TablesService tablesService = new TablesService(tablesRepository, null);
        Tables table = new Tables();
        UUID id = UUID.randomUUID();

        Mockito.when(tablesRepository.findById(id)).thenReturn(Optional.of(table));

        tablesService.delete(id);

        Mockito.verify(tablesRepository).delete(table);
    }
}

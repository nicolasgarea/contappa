package com.contappa.core.mappers;

import com.contappa.core.dto.table.CreateTableRequestDTO;
import com.contappa.core.dto.table.TablesDTO;
import com.contappa.core.dto.table.UpdateTableRequestDTO;
import com.contappa.core.models.Tables;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TablesMapper {

    TablesDTO toTablesDTO(Tables table);

    Tables toTables(TablesDTO tableDTO);

    @Mapping(target = "id", ignore = true)
    Tables toTables(CreateTableRequestDTO createTableRequestDTO);

    @Mapping(target = "id", ignore = true)
    Tables toTables(UpdateTableRequestDTO updateTableRequestDTO);
}

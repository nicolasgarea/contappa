package com.contappa.core.mappers;

import com.contappa.core.dto.TablesDTO;
import com.contappa.core.models.Tables;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TablesMapper {

    TablesDTO toTablesDTO(Tables table);

    Tables toTables(TablesDTO tableDTO);
}

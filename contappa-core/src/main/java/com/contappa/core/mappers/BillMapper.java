package com.contappa.core.mappers;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.models.Bill;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BillMapper {

    BillDTO toBillDTO(Bill bill);

    Bill toBill(BillDTO billDTO);

    Bill toBill(CreateBillRequestDTO createBillRequestDTO);


}

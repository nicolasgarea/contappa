package com.contappa.core.controllers;


import com.contappa.core.dto.bill.BillDTO;
import com.contappa.core.dto.bill.CreateBillRequestDTO;
import com.contappa.core.dto.bill.SplitBillRequestDTO;
import com.contappa.core.dto.bill.UpdateBillRequestDTO;
import com.contappa.core.exceptions.BillNotFoundException;
import com.contappa.core.services.BillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tables/{tableId}/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService){
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<BillDTO> createBill(@PathVariable UUID tableId, @RequestBody CreateBillRequestDTO billRequestDTO){
        billRequestDTO.setTableId(tableId);
        BillDTO billDTO = billService.create(billRequestDTO);
        return new ResponseEntity<>(billDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBillById(@PathVariable UUID tableId, @PathVariable UUID id){
        BillDTO billDTO = billService.findById(id);
        if (!billDTO.getTableId().equals(tableId)) {
            throw new BillNotFoundException("Bill not found in this table.");
        }
        return ResponseEntity.ok(billDTO);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BillDTO> updateBill(@PathVariable UUID tableId, @PathVariable UUID id, @RequestBody UpdateBillRequestDTO billDTO){
        BillDTO existing = billService.findById(id);
        if (!existing.getTableId().equals(tableId)) {
            throw new BillNotFoundException("Bill not found in this table.");
        }
        BillDTO updated = billService.update(id, billDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/split")
    public ResponseEntity<List<BillDTO>> splitBill(@PathVariable UUID tableId, @PathVariable UUID id, @RequestBody SplitBillRequestDTO splitRequest){
        BillDTO existing = billService.findById(id);
        if (!existing.getTableId().equals(tableId)) {
            throw new BillNotFoundException("Bill not found in this table.");
        }
        List<BillDTO> splitBills = billService.splitBill(id, splitRequest);
        return new ResponseEntity<>(splitBills, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable UUID tableId, @PathVariable UUID id){
        BillDTO existing = billService.findById(id);
        if (!existing.getTableId().equals(tableId)) {
            throw new BillNotFoundException("Bill not found in this table.");
        }
        billService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

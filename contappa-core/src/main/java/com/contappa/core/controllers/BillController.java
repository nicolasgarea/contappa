package com.contappa.core.controllers;

import com.contappa.core.dto.BillDTO;
import com.contappa.core.dto.CreateBillRequestDTO;
import com.contappa.core.dto.UpdateBillRequestDTO;
import com.contappa.core.services.BillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bills")
public class BillController {
    private final BillService billService;

    public BillController(BillService billService){
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<BillDTO> createBill(@RequestBody CreateBillRequestDTO billRequestDTO){
        BillDTO billDTO = billService.create(billRequestDTO);
        return new ResponseEntity<>(billDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDTO> getBillById(@PathVariable UUID id){
        BillDTO billDTO = billService.findById(id);
        return ResponseEntity.ok(billDTO);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<BillDTO> updateBill(@PathVariable UUID id, @RequestBody UpdateBillRequestDTO billDTO){
        BillDTO updated = billService.update(id, billDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable UUID id){
        billService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

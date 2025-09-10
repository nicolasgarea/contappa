package com.contappa.core.dto;

import java.util.List;

public class SplitBillRequestDTO {
    private List<SplitDTO> splits;

    public SplitBillRequestDTO(List<SplitDTO> splits) {
        this.splits = splits;
    }

    public List<SplitDTO> getSplits() {
        return splits;
    }

    public void setSplits(List<SplitDTO> splits) {
        this.splits = splits;
    }
}

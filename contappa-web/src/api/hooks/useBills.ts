import { CreateBillRequest, UpdateBillRequest, Bill, SplitBillRequest } from "@api/__generated__";
import { BillId } from "@api/types/aliases";
import { createBill, updateBill, deleteBill, getBills, getBillById, splitBill } from "@api/client/services/bills";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { TableId } from "@api/types/aliases";

interface UpdateBillInput {
    billId: BillId
    billData: UpdateBillRequest;
}

export const useBills = (tableId: TableId) => {
    return useQuery<Bill[], Error>({
        queryKey: ["tables", tableId, "bills"],
        queryFn: () => getBills(tableId),
    });
}

export const useBillById = (tableId: TableId, billId: BillId) => {
    return useQuery<Bill, Error>({
        queryKey: ["tables", tableId, "bills", billId],
        queryFn: () => getBillById(tableId, billId),
    });
}

export const useCreateBill = (tableId: TableId) => {
    const queryClient = useQueryClient();
    return useMutation(
        (billData: CreateBillRequest) => createBill(tableId, billData),
        {
            onSuccess: () => queryClient.invalidateQueries(["tables", tableId, "bills"]),
        }
    );
}

export const useUpdateBill = (tableId: TableId) => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ billId, billData }: UpdateBillInput) => updateBill(tableId, billId, billData),
        {
            onSuccess: () => queryClient.invalidateQueries(["tables", tableId, "bills"]),
        }
    );
}

export const useDeleteBill = (tableId: TableId) => {
    const queryClient = useQueryClient();
    return useMutation(
        (billId: BillId) => deleteBill(tableId, billId),
        {
            onSuccess: () => queryClient.invalidateQueries(["tables", tableId, "bills"]),
        }
    );
}

export const useSplitBill = (tableId: TableId) => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ billId, splitData }: { billId: BillId; splitData: SplitBillRequest }) => splitBill(tableId, billId, splitData),
        {
            onSuccess: () => queryClient.invalidateQueries(["tables", tableId, "bills"]),
        }
    );
}

import client from "@api/client/client";
import { CreateBillRequest, UpdateBillRequest, Bill } from "@api/__generated__";
import { BillId } from "@api/types/bill";
import { createBill, updateBill, deleteBill, getBills, getBillById } from "@api/client/services/bills";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import queryClient from "@api/queryClient";

interface UpdateBillInput {
    billId: BillId
    billData: UpdateBillRequest;
}

export const useBills = () => {
    return useQuery<Bill[], Error>({
        queryKey: ["bills"],
        queryFn: () => getBills()
    });
}

export const useBillById = (billId: BillId) => {
    return useQuery<Bill, Error>({
        queryKey: ["bills", billId],
        queryFn: () => getBillById(billId),
    });
}

export const useCreateBill = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (billData: CreateBillRequest) => createBill(billData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["bills"]);
            }
        }
    );
}

export const useUpdateBill = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ billData, billId } : UpdateBillInput)
    )
}
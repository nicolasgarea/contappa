import client from "@api/client/client"
import { Bill, CreateBillRequest, UpdateBillRequest, SplitBillRequest } from "@api/__generated__";
import { BillId, TableId } from "@api/types/aliases";

const billsEndpoint = (tableId: TableId) => `tables/${tableId}/bills`;
const billsByIdEndpoint = (tableId: TableId, billId: BillId) =>
    `tables/${tableId}/bills/${billId}`;
const splitBillEndpont = (tableId: TableId, billId: BillId) =>
    `tables/${tableId}/bills/${billId}/split`;

export const getBills = (tableId: TableId): Promise<Bill[]> =>
    client.get<Bill[]>(billsEndpoint(tableId)).then(response => response.data);

export const getBillById = (tableId: TableId, billId: BillId): Promise<Bill> =>
    client.get<Bill>(billsByIdEndpoint(tableId, billId)).then(response => response.data);

export const createBill = (tableId: TableId, billData: CreateBillRequest): Promise<Bill> =>
    client.post<Bill>(billsEndpoint(tableId), billData).then(response => response.data);

export const updateBill = (tableId: TableId, billId: BillId, billData: UpdateBillRequest): Promise<Bill> =>
    client.patch<Bill>(billsByIdEndpoint(tableId, billId), billData).then(response => response.data);

export const deleteBill = (tableId: TableId, billId: BillId): Promise<void> =>
    client.delete<void>(billsByIdEndpoint(tableId, billId)).then(response => response.data);

export const splitBill = (tableId: TableId, billId: BillId, splitData: SplitBillRequest): Promise<Bill[]> =>
    client.post<Bill[]>(splitBillEndpont(tableId, billId), splitData).then(response => response.data);

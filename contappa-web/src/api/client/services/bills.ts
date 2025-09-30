import client from "@api/client/client"
import { Bill, CreateBillRequest, UpdateBillRequest } from "@api/__generated__";
import { BillId } from "@api/types/bill";

const billsEndpoint = "bills";
const billsByIdEndpoint = (billId: BillId) => `bills/${billId}`;

export const getBills = (): Promise<Bill[]> => client.get<Bill[]>(billsEndpoint).then(response => response.data);

export const getBillById = (billId: BillId): Promise<Bill> => client.get<Bill>(billsByIdEndpoint(billId)).then(response => response.data);

export const createBill = (billData: CreateBillRequest): Promise<Bill> => client.post<Bill>(billsEndpoint, billData).then(response => response.data);

export const updateBill = (billId: BillId, billData: UpdateBillRequest): Promise<Bill> => client.patch<Bill>(billsByIdEndpoint(billId), billData).then(response => response.data);

export const deleteBill = (billId: BillId): Promise<void> => client.delete<void>(billsByIdEndpoint(billId)).then(response => response.data);

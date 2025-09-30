import client from "@api/client/client"
import { CreateTableRequest, Table, TableId, UpdateTableRequest } from "@api/__generated__"

const tablesEndpoint = "tables";
const tablesByIdEndpoint = (tableId: TableId) => `tables/${tableId}`;

export const getTables = (): Promise<Table[]> => client.get<Table[]>(tablesEndpoint).then((response) => response.data);

export const getTableById = (tableId: TableId): Promise<Table> => client.get<Table>(tablesByIdEndpoint(tableId)).then((response) => response.data);

export const createTable = (tableData: CreateTableRequest): Promise<Table> => client.post<Table>(tablesEndpoint, tableData).then((response) => response.data);

export const updateTable = (tableId: TableId, tableData: UpdateTableRequest): Promise<Table> => client.patch<Table>(tablesByIdEndpoint(tableId), tableData).then((response) => response.data);

export const deleteTable = (tableId: TableId): Promise<void> => client.delete<void>(tablesByIdEndpoint(tableId)).then((response) => response.data);

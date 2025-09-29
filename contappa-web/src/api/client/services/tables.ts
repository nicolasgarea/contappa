import client from "@api/client/client"
import { Table, TableId } from "@api/__generated__"

const tablesEndpoint = "tables";
const tablesByIdEndpoint = (tableId: TableId) => `tables/${tableId}`;

export const getTables = () => client.get(tablesEndpoint).then((response) => response.data);

export const getTablesById = (tableId: TableId) => client.get(tablesByIdEndpoint(tableId)).then((response) => response.data);

export const createTable = (tableData: Table) => client.post(tablesEndpoint, tableData).then((response) => response.data);

export const updateTable = (tableId: TableId, tableData: Partial<Table>) => client.patch(tablesByIdEndpoint(tableId), tableData).then((response) => response.data);

export const deleteTable = (tableId: TableId) => client.delete(tablesByIdEndpoint(tableId)).then((response) => response.data);
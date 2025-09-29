import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableId } from "@api/__generated__"
import { getTables, getTablesById, createTable, updateTable, deleteTable } from "@api/client/services/tables";

interface UpdateTableInput {
    tableId: TableId;
    tableData: Partial<Table>;
}

export const useTables = () => {
    return useQuery<Table[], Error>({
        queryKey: ["tables"],
        queryFn: () => getTables(),
    });
}

export const useTablesById = (tableId: TableId) => {
    return useQuery<Table, Error>({
        queryKey: ["tables", tableId],
        queryFn: () => getTablesById(tableId),
    })
}

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (tableData: Table) => createTable(tableData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tables"]);
            }
        }
    );
}

export const useUpdateTable = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ tableId, tableData }: UpdateTableInput) => updateTable(tableId, tableData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tables"]);
            }
        }
    )
}

export const useDeleteTable = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (tableId: TableId) => deleteTable(tableId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["tables"])
            }
        }
    )
}

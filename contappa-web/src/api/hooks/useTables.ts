import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTableRequest, Table, UpdateTableRequest } from "@api/__generated__"
import { getTables, getTableById, createTable, updateTable, deleteTable } from "@api/client/services/tables";
import { TableId } from "@api/types/aliases";

interface UpdateTableInput {
    tableId: TableId;
    tableData: UpdateTableRequest;
}

export const useTables = () => {
    return useQuery<Table[], Error>({
        queryKey: ["tables"],
        queryFn: () => getTables(),
    });
}

export const useTableById = (tableId: TableId) => {
    return useQuery<Table, Error>({
        queryKey: ["tables", tableId],
        queryFn: () => getTableById(tableId),
    })
}

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation(
        (tableData: CreateTableRequest) => createTable(tableData),
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

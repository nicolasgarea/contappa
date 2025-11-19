import { useForm, SubmitHandler } from "react-hook-form"
import { useTables, useCreateTable, useDeleteTable, useUpdateTable } from "@api/hooks/useTables"
import { CreateTableRequest, Table } from "@api/__generated__";
import styled from "styled-components";
import Button from "@components/Button/Button";


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5%;
  z-index: 1000;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  width: 90%;
  max-width: 500px;
  font-family: sans-serif;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    align-self: flex-start;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 3px rgba(0,123,255,0.5);
  }
`;

type TableFormProps = {
    onClose?: () => void;
};

export default function TableForm({ onClose }: TableFormProps) {
    const { register, handleSubmit, reset } = useForm<CreateTableRequest>()

    const { data: tables, isLoading, error } = useTables();

    const createMutation = useCreateTable();

    const deleteMutation = useDeleteTable();

    const updateMutation = useUpdateTable();

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const onSubmit: SubmitHandler<CreateTableRequest> = (data) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                reset();
                onClose?.();
            }
        });
    };

    return (
        <Overlay>
            <FormContainer onSubmit={handleSubmit(onSubmit)}  >
                <h1>Create a new table</h1>
                <Row>
                    <Input
                        type="number"
                        {...register("number", { required: true, min: 1, valueAsNumber: true })}
                        placeholder="Enter table number"
                    />
                </Row>
                <ButtonRow>
                    <Button typeButton="button" label="Cancel" onClick={onClose} color="red" />
                    <Button typeButton="submit" label="Create table" />
                </ButtonRow>
            </FormContainer>
        </Overlay>
    )

}
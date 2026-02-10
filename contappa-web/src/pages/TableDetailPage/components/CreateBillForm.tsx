import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useCreateBill } from "@api/hooks/useBills";
import { CreateBillRequest } from "@api/__generated__";
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
  padding-top: 6rem;
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
  width: 100%;
  max-width: 400px;
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

const ProductRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

type CreateBillFormProps = {
    tableId: string;
    onClose?: () => void;
};

export default function CreateBillForm({ tableId, onClose }: CreateBillFormProps) {
    const { register, handleSubmit, control, reset } = useForm<CreateBillRequest>({
        defaultValues: {
            amount: 0,
            products: [{ productId: "", quantity: 1 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const createMutation = useCreateBill(tableId);

    const onSubmit: SubmitHandler<CreateBillRequest> = (data) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                reset();
                onClose?.();
            }
        });
    };

    return (
        <Overlay>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <h1>Create a new Bill</h1>

                <Row>
                    <Input
                        type="number"
                        {...register("amount", { required: true, min: 0, valueAsNumber: true })}
                        placeholder="Enter total amount"
                    />
                </Row>

                <h3>Products</h3>
                {fields.map((field, index) => (
                    <ProductRow key={field.id}>
                        <Input
                            {...register(`products.${index}.productId` as const, { required: true })}
                            placeholder="Product ID"
                        />
                        <Input
                            type="number"
                            {...register(`products.${index}.quantity` as const, { required: true, min: 1, valueAsNumber: true })}
                            placeholder="Quantity"
                        />
                        <Button typeButton="button" label="Remove" color="#E63F39" onClick={() => remove(index)} />
                    </ProductRow>
                ))}
                <Button typeButton="button" label="+ Add Product" color="#10b981" onClick={() => append({ productId: "", quantity: 1 })} />

                <ButtonRow>
                    <Button typeButton="button" label="Cancel" onClick={onClose} color="#E63F39" />
                    <Button typeButton="submit" label="Create Bill" color="#df8826ff" />
                </ButtonRow>
            </FormContainer>
        </Overlay>
    );
}

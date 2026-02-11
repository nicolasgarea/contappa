import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import Button from "@components/Button/Button";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;
  z-index: 1000;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 12px;
  background-color: #fff;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #df8826;
    box-shadow: 0 0 4px rgba(223, 136, 38, 0.5);
  }
`;

const Select = styled.select`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  background-color: #f9f9f9;
  cursor: not-allowed;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export type ProductFormInputs = {
    name: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
};

type ProductFormProps = {
    onClose?: () => void;
    onSubmit: (data: ProductFormInputs) => void;
    categories: { id: string; name: string }[];
    selectedCategoryId: string;
};

export default function ProductForm({
    onClose,
    onSubmit,
    categories,
    selectedCategoryId,
}: ProductFormProps) {
    const { register, handleSubmit, reset } = useForm<ProductFormInputs>({
        defaultValues: { categoryId: selectedCategoryId },
    });

    const handleFormSubmit: SubmitHandler<ProductFormInputs> = (data) => {
        if (!data.categoryId) {
            console.error("No category selected");
            return;
        }

        onSubmit(data);

        reset({ categoryId: selectedCategoryId });
        onClose?.();
    };

    const categoryName = categories.find(cat => cat.id === selectedCategoryId)?.name || "Unknown";

    return (
        <Overlay>
            <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
                <Title>Create Product</Title>

                <Input {...register("name", { required: true })} placeholder="Product Name" />
                <Input
                    type="number"
                    step="0.01"
                    {...register("price", { required: true, valueAsNumber: true })}
                    placeholder="Price"
                />
                <Input {...register("imageUrl")} placeholder="Image URL (optional)" />

                <Select value={selectedCategoryId} disabled>
                    <option value={selectedCategoryId}>{categoryName}</option>
                </Select>

                <Actions>
                    <Button typeButton="button" label="Cancel" onClick={onClose} color="#E63F39" />
                    <Button typeButton="submit" label="Create" color="#df8826ff" />
                </Actions>
            </FormContainer>
        </Overlay>
    );
}

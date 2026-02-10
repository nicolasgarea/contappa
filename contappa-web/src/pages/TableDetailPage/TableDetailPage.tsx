import { useParams, useNavigate } from "react-router-dom";
import { useDeleteBill, useUpdateBill, useCreateBill } from "@api/hooks/useBills";
import { useTableById } from "@api/hooks/useTables";
import BillCard from "@components/Bills/BillCard";
import Navbar from "@components/Navbar/Navbar";
import Button from "@components/Button/Button";
import { useState } from "react";
import styled from "styled-components";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { CreateBillRequest } from "@api/__generated__";

const PageContainer = styled.div`
  background-color: #f4f7fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 4rem;
`;

const TableTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 2rem;
  margin: 2rem 4rem;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const BillDetailsCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 50vh;
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
`;

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
  gap: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 3px rgba(0,123,255,0.5);
  }
`;

export default function TableDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showCreateBillForm, setShowCreateBillForm] = useState(false);

  if (!id) return <div>Table ID not found</div>;

  const { data: table, refetch, isLoading, error } = useTableById(id);
  const bills = table?.activeBills || [];
  const selectedBill = selectedBillId ? bills.find(b => b.id === selectedBillId) : bills[0];

  const deleteMutation = useDeleteBill(id);
  const updateMutation = useUpdateBill(id);
  const createMutation = useCreateBill(id);

  const { register, handleSubmit, control, reset } = useForm<CreateBillRequest>();
  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  if (isLoading) return <div>Loading table...</div>;
  if (error) return <div>Error loading table: {error.message}</div>;
  if (!table) return <div>Table not found</div>;

  const onSubmit: SubmitHandler<CreateBillRequest> = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setShowCreateBillForm(false);
        refetch();
      }
    });
  };

  return (
    <PageContainer>
      <Navbar />
      <Header>
        <TableTitle>Table #{table.number}</TableTitle>
        <Button
          label="+ Create Bill"
          color="#df8826ff"
          onClick={() => setShowCreateBillForm(true)}
        />
      </Header>

      {showCreateBillForm && (
        <Overlay>
          <FormContainer onSubmit={handleSubmit(onSubmit)}>
            <h2>Create Bill</h2>

            {fields.map((field, index) => (
              <ProductRow key={field.id}>
                <Input
                  placeholder="Product ID"
                  {...register(`products.${index}.productId` as const, { required: true })}
                />
                <Input
                  placeholder="Quantity"
                  type="number"
                  {...register(`products.${index}.quantity` as const, { required: true, valueAsNumber: true })}
                />
                <Button typeButton="button" label="Remove" color="#E63F39" onClick={() => remove(index)} />
              </ProductRow>
            ))}

            <Button typeButton="button" label="Add Product" color="#007bff" onClick={() => append({ productId: "", quantity: 1 })} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
              <Button typeButton="button" label="Cancel" color="#E63F39" onClick={() => setShowCreateBillForm(false)} />
              <Button typeButton="submit" label="Create Bill" color="#10b981" />
            </div>
          </FormContainer>
        </Overlay>
      )}

      <MainGrid>
        <LeftColumn>
          <Button label="← Back" color="#6b7280" onClick={() => navigate(-1)} />
          <BillsList>
            {bills.map(bill => (
              <BillCard
                key={bill.id!}
                bill={{
                  id: bill.id!,
                  amount: bill.amount!,
                  paid: bill.paid!,
                  date: bill.date!,
                }}
                onClick={() => setSelectedBillId(bill.id!)}
                selected={bill.id === selectedBill?.id}
              />
            ))}
          </BillsList>
        </LeftColumn>

        <RightColumn>
          <BillDetailsCard>
            {selectedBill ? (
              <>
                <h2>Bill Details</h2>
                <div>ID: {selectedBill.id}</div>
                <div>Date: {selectedBill.date}</div>
                <div>Amount: ${selectedBill.amount?.toFixed(2)}</div>
                <div>Status: {selectedBill.paid ? "Paid" : "Pending"}</div>

                <h3>Products</h3>
                <ProductsList>
                  {selectedBill.products?.map((p, index) => (
                    <ProductRow key={p.productId ?? index}>
                      <span>Product {p.productId}</span>
                      <span>Quantity: {p.quantity}</span>
                      <span>Price: ${((p.quantity || 0) * 10).toFixed(2)}</span>
                    </ProductRow>
                  ))}
                </ProductsList>

                <Button
                  label="Delete Bill"
                  color="#ef4444"
                  onClick={() => deleteMutation.mutate(selectedBill.id!, { onSuccess: () => refetch() })}
                />

                {!selectedBill.paid && (
                  <Button
                    label="Pay bill"
                    color="#10b981"
                    onClick={() =>
                      updateMutation.mutate(
                        { billId: selectedBill.id!, billData: { ...selectedBill, paid: true } },
                        { onSuccess: () => refetch() }
                      )
                    }
                  />
                )}
              </>
            ) : (
              <div>No bills available</div>
            )}
          </BillDetailsCard>
        </RightColumn>
      </MainGrid>
    </PageContainer>
  );
}

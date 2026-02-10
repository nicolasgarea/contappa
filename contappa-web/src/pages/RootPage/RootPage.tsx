import Navbar from "@components/Navbar/Navbar";
import TableCard from "./components/TableCard";
import Button from "@components/Button/Button";
import styled from "styled-components";
import { useTables } from "@api/hooks/useTables";
import { useState } from "react";
import TableForm from "./components/TableForm";
import SideBar from "./components/SideBar";
import { useNavigate } from 'react-router-dom';

const RootContainer = styled.div`
  background-color: #f4f7fa;
  min-height: 100vh;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  margin: 2rem 4rem 1rem 4rem;
  border-bottom: 1px solid #ccc;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 10rem;
  margin: 2rem 4rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 4rem 0 4rem;
`;

export default function RootPage() {
  const navigate = useNavigate();
  const { data: tables, isLoading, error } = useTables();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "occupied">("all");

  if (isLoading) return <div>Loading tables...</div>;
  if (error) return <div>Error loading tables: {error.message}</div>;
  if (!tables?.length) return <div>No tables found.</div>;

  const filteredTables = tables.filter(table => {
    const hasActiveBills = (table.activeBills?.length || 0) > 0;
    if (statusFilter === "all") return true;
    if (statusFilter === "available") return !hasActiveBills;
    if (statusFilter === "occupied") return hasActiveBills;
  });

  return (
    <RootContainer>
      <Navbar />
      <FormContainer>
        {showForm && <TableForm onClose={() => setShowForm(false)} />}
      </FormContainer>

      <HeadContainer>
        <h1>Table Management</h1>
        <Button
          label={"+ Create Table"}
          color="#df8826ff"
          onClick={() => setShowForm(prev => !prev)}
        />
      </HeadContainer>

      <MainGrid>
        <SideBar setFilter={setStatusFilter} />
        <ContentContainer>
          {filteredTables
            .sort((a, b) => a.number! - b.number!)
            .map(table => {
              const activeBills = table.activeBills || [];
              const totalActiveAmount = activeBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
              const available = activeBills.length === 0;

              return (
                <TableCard
                  key={table.id}
                  number={table.number!}
                  available={available}
                  activeBillAmount={totalActiveAmount}
                  onClick={() => navigate(`/tables/${table.id}`)}
                />
              );
            })}
        </ContentContainer>
      </MainGrid>
    </RootContainer>
  );
}

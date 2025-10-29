import Navbar from "@components/Navbar/Navbar"
import TableCard from "./components/TableCard"
import Button from "@components/Button/Button"
import styled from "styled-components";
import { useTables } from "@api/hooks/useTables";
import { useState } from "react";



const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 5rem 7rem;
  `;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem;
`;

export default function RootPage() {
  const { data: tables, isLoading, error } = useTables();
  const [showForm, setShowForm] = useState(false);
  if (isLoading) return <div>Loading tables...</div>;
  if (error) return <div>Error loading tables: {error.message}</div>;
  if (!tables?.length) return <div>No tables found.</div>;
  return <div>
    <Navbar />

    <ButtonContainer>
      <Button label={showForm ? "Cancel" : "Create Table"} onClick={() => setShowForm((prev: boolean) => !prev)} />
    </ButtonContainer>
    <GridContainer>
      {tables!.map((table: any) => <TableCard key={table.id} number={table.number} />)}
    </GridContainer>
  </div >
}

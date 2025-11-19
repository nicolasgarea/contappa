import Navbar from "@components/Navbar/Navbar"
import TableCard from "./components/TableCard"
import Button from "@components/Button/Button"
import styled from "styled-components";
import { useTables } from "@api/hooks/useTables";
import { useState } from "react";
import TableForm from "./components/TableForm";



const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  margin: 2rem 5rem 0rem 4rem;
  margin-bottom: 0;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  justify-content: flex-start;
  max-width: 1600px;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  align-items: center;
`

export default function RootPage() {
  const { data: tables, isLoading, error } = useTables();
  const [showForm, setShowForm] = useState(false);
  if (isLoading) return <div>Loading tables...</div>;
  if (error) return <div>Error loading tables: {error.message}</div>;
  if (!tables?.length) return <div>No tables found.</div>;
  return <div>
    <Navbar />

    <HeadContainer>
      <h1>Table Management</h1>
      <Button label={"Create Table"} onClick={() => setShowForm((prev: boolean) => !prev)} />
    </HeadContainer>
    <FormContainer>
      {showForm && <TableForm onClose={() => setShowForm(false)} />}
    </FormContainer>
    <FlexContainer>
      {tables
        ?.sort((a, b) => a.number! - b.number!)
        .map((table) => (
          <TableCard key={table.id} number={table.number!} />
        ))}
    </FlexContainer>
  </div >
}

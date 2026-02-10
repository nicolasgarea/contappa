import styled from "styled-components";
import { useState } from "react";
import { useTables } from "@api/hooks/useTables";

const SideBarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 1.5rem;
  margin-top: 1.2rem;
  gap: 0rem;
  font-family: sans-serif;
  background-color: white;
  border-radius: 1rem;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
`;

const Row = styled.div<{ color?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111;

  background-color: ${({ color }) => color ? `${color}22` : "#e0e0e0"}; 
  border: 2px solid ${({ color }) => color ? `${color}88` : "#b0b0b0"}; 

  box-shadow: 0 2px 6px rgba(0,0,0,0.08);

  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
`;



const FilterButton = styled.button<{ active?: boolean; color?: string }>`
  flex: 1;
  padding: 0.5rem 0.8rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background-color: ${({ color, active }) => active ? color : `${color}66`};
  border: ${({ active, color }) => active ? `2px solid ${color}` : '2px solid transparent'};
  box-shadow: ${({ active }) =>
    active ? 'inset 0 3px 6px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: ${({ color }) => `${color}cc`};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.4);
  }
`;

type Status = "all" | "available" | "occupied";

export default function SideBar({ setFilter }: { setFilter: (filter: Status) => void }) {
  const { data: tables = [] } = useTables();
  const [activeStatus, setActiveStatus] = useState("all");

  const total = tables.length;
  const available = tables.filter(t => !t.activeBills).length;
  const occupied = tables.filter(t => t.activeBills).length;

  const handleStatusFilter = (status: Status) => {
    setActiveStatus(status);
    setFilter(status);
  };

  const totalAmount = tables
    .flatMap(t => t.activeBills ?? [])
    .reduce((sum, bill) => sum + (bill.amount ?? 0), 0);

  return (
    <SideBarContainer>
      <Section>
        <SectionTitle>Summary</SectionTitle>
        <Row color="#df8826ff"><span>Total Tables</span><span>{total}</span></Row>
        <Row color="#10b98157"><span>Available</span><span>{available}</span></Row>
        <Row color="#ef444467"><span>Occupied</span><span>{occupied}</span></Row>
        <Row color="#0050fd69" style={{ marginTop: "0" }}>
          <span>Total Billing</span><span>${totalAmount}</span>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Filter by Status</SectionTitle>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <FilterButton active={activeStatus === "all"} color="#4b5563" onClick={() => handleStatusFilter("all")}>All</FilterButton>
          <FilterButton active={activeStatus === "available"} color="#10b981" onClick={() => handleStatusFilter("available")}>Available</FilterButton>
          <FilterButton active={activeStatus === "occupied"} color="#ef4444" onClick={() => handleStatusFilter("occupied")}>Occupied</FilterButton>
        </div>
      </Section>
    </SideBarContainer>
  );
}

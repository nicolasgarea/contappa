import RestaurantIcon from '@mui/icons-material/Restaurant';
import styled from 'styled-components';


type TableCardProps = {
    number: string;
};

const StyledCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 30vh;
    width: 15vw;
    font-weight: bold;
    font-size: 1.4rem;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease; /* suaviza la animación */

    &:hover {
        transform: translateY(-2px);
        cursor: pointer;
    }
`;

const SyledRestaurantIcon = styled(RestaurantIcon)`
    font-size: 4rem !important;
`;

const StyledTable = styled.div`
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
`;

export default function TableCard({ number }: TableCardProps) {
    return <StyledCard>
        <StyledTable>
            Table {number}
        </StyledTable>
        <SyledRestaurantIcon />
    </StyledCard>;
}
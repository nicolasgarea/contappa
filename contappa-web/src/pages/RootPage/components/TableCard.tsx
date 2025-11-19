import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import styled from 'styled-components';


type TableCardProps = {
    number: string;
};

const StyledCard = styled.div`
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 1rem;
    margin: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 230px;
    width: 230px;
    font-weight: bold;
    font-size: 1.4rem;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease;

    &:hover {
        transform: translateY(-2px);
        cursor: pointer;
    }
`;

const SyledRestaurantIcon = styled(RestaurantMenuIcon)`
    font-size: 6rem !important;
`;

const StyledTable = styled.div`
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
`;

export default function TableCard({ number }: TableCardProps) {
    return <StyledCard>
        <StyledTable>
            Table {number}
        </StyledTable>
        <SyledRestaurantIcon />
    </StyledCard>;
}
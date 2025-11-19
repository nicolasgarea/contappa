import styled from 'styled-components';
import Item from './components/Items';
import Title from './components/Title';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #1a1a1a, #222);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  color: #fff;
  font-family: 'Inter', sans-serif;
  flex-wrap: wrap;
`;

const TitleWrapper = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5f5f5;
`;

const NavItems = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap; 
`;


export default function Navbar() {
  return (
    <NavbarContainer>
      <TitleWrapper>
        <Title />
      </TitleWrapper>
      <NavItems>
        <Item item="Tables" icon={<TableRestaurantIcon />} />
        <Item item="Products" icon={<RestaurantIcon />} />
        <Item item="Bills" icon={<RequestQuoteIcon />} />
      </NavItems>
    </NavbarContainer>
  );
}

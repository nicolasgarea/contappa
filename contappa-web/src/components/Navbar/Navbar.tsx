import styled from 'styled-components';
import Item from './components/Items';
import Title from './components/Title';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center; 
  height: 8vh;
  padding: 0 2rem;
  background: linear-gradient(90deg, #1a1a1a, #222);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  color: #fff;
  font-family: 'Inter', sans-serif;
  position: relative;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

const TitleWrapper = styled.div`
  position: absolute;
  left: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5f5f5;
`;

export default function Navbar() {
  return (
    <NavbarContainer>
      <TitleWrapper>
        <Title />
      </TitleWrapper>
      <NavItems>
        <Item item="Tables" icon={<TableBarIcon />} />
        <Item item="Products" icon={<RestaurantIcon />} />
        <Item item="Bills" icon={<RequestQuoteIcon />} />
      </NavItems>
    </NavbarContainer>
  );
}

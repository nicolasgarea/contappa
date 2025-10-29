import styled from 'styled-components';

const TitleContainer = styled.div`
    display: flex;
    self-align: left;
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
`;

export default function Title() {
    return <TitleContainer>Contappa</TitleContainer>;
}
import React from 'react';
import styled from 'styled-components';
import Link from './components/link';

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ededed;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
`;

const App: React.FC = () => {
  return (
    <StyledContainer>
      <LinkContainer>
        <Link content="博客~Prime Number~" url="https://delbertbeta.cc" />
        <Link content="博客" url="https://delbertbeta.cc" />
      </LinkContainer>
    </StyledContainer>
  );
}

export default App;

import styled, { keyframes } from 'styled-components';

import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const reverseSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const OuterSpinner = styled.div`
  position: absolute;
  inset: 0;
  border-top: 4px solid #3b82f6;
  border-radius: 9999px;
  animation: ${spin} 1.5s linear infinite;
`;

const InnerSpinner = styled.div`
  position: absolute;
  inset: 0.5rem;
  border-right: 4px solid #93c5fd;
  border-radius: 9999px;
  animation: ${reverseSpin} 1s linear infinite;
`;

const Message = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
`;

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading data...' 
}) => {
  return (
    <Container>
      <SpinnerContainer>
        <OuterSpinner />
        <InnerSpinner />
      </SpinnerContainer>
      <Message>{message}</Message>
    </Container>
  );
}; 
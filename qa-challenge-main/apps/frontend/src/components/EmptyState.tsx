import { Button } from './Button';
import React from 'react';
import styled from 'styled-components';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const Container = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  background-color: #eff6ff;
  padding: 1rem;
  border-radius: 9999px;
  margin-bottom: 1rem;
`;

const DefaultIcon = styled.svg`
  height: 2rem;
  width: 2rem;
  color: #3b82f6;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <Container>
      <ContentWrapper>
        <IconWrapper>
          {icon || (
            <DefaultIcon fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </DefaultIcon>
          )}
        </IconWrapper>
        
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            {actionLabel}
          </Button>
        )}
      </ContentWrapper>
    </Container>
  );
}; 
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md';
  hover?: boolean;
}

const paddingStyles = {
  none: css`padding: 0;`,
  sm: css`padding: 0.75rem;`,
  md: css`padding: 1.25rem;`,
  lg: css`padding: 2rem;`,
};

const shadowStyles = {
  none: css`box-shadow: none;`,
  sm: css`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);`,
  md: css`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`,
};

const StyledCard = styled.div<CardProps>`
  background-color: white;
  border-radius: 0.75rem;
  
  ${props => props.padding && paddingStyles[props.padding]}
  ${props => props.shadow && shadowStyles[props.shadow]}
  
  ${props => props.hover && css`
    transition: box-shadow 0.2s;
    &:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  ...props
}) => {
  return (
    <StyledCard 
      className={className}
      padding={padding}
      shadow={shadow}
      hover={hover}
      {...props}
    >
      {children}
    </StyledCard>
  );
}; 
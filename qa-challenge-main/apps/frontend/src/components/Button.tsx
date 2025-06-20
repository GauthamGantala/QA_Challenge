import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ButtonStyles = {
  variant: {
    primary: css`
      background-color: #3b82f6;
      color: white;
      &:hover:not(:disabled) {
        background-color: #2563eb;
      }
    `,
    secondary: css`
      background-color: #f3f4f6;
      color: #374151;
      &:hover:not(:disabled) {
        background-color: #e5e7eb;
      }
    `,
    outline: css`
      background-color: white;
      color: #374151;
      border: 1px solid #e5e7eb;
      &:hover:not(:disabled) {
        background-color: #f9fafb;
      }
    `,
  },
  size: {
    sm: css`
      font-size: 0.75rem;
      padding: 0.375rem 0.625rem;
    `,
    md: css`
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
    `,
    lg: css`
      font-size: 1rem;
      padding: 0.625rem 1rem;
    `,
  },
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s;
  border-radius: 0.5rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  ${(props) => props.variant && ButtonStyles.variant[props.variant]}
  ${(props) => props.size && ButtonStyles.size[props.size]}
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const SpinnerSvg = styled.svg`
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  margin-left: -0.25rem;
  height: 1rem;
  width: 1rem;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerSvg
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              opacity="0.25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              opacity="0.75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </SpinnerSvg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {children}
        </>
      )}
    </StyledButton>
  );
}; 
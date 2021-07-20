import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';

export const StyledIconButton = styled.button<{ theme: ThemeProps } & { className?: string }>`
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 1rem;
  padding: 1rem;
  font-weight: 600;
`;

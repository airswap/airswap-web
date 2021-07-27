import styled from "styled-components/macro";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "../Typography/Typography";
import TokenSelect from "../TokenSelect/TokenSelect";
import Button from "../Button/Button";

export const Header = styled.div`
  margin-bottom: 3rem;
  min-height: 2rem;
`;

export const QuoteAndTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const TimerContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  /* TODO: THEME */
  border: 1px solid
    ${(props) => (props.theme.name === "dark" ? "#282828" : "#ededed")};
`;

export const StyledViewAllLink = styled(Link)`
  align-self: center;
  margin: 1rem 0;
  cursor: pointer;
`;

export const StyledTokenSelect = styled(TokenSelect)`
  &:last-of-type {
    margin-bottom: 3rem;
  }
`;

export const SubmitButton = styled(Button)`
  margin-bottom: 2.75rem;
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleAndBackButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  /* This will only affect the button because the title has its own size */
  font-size: 1.5rem;
`;

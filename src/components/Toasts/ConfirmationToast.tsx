import { FC } from "react";
import { HiX } from "react-icons/hi";
import { MdBeenhere } from "react-icons/md";

import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  Container,
  IconContainer,
  HiXContainer,
  TextContainer,
} from "./Toast.styles";

export type ErrorToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  heading: string;
  cta: string;
};

const ErrorToast: FC<ErrorToastProps> = ({ onClose, heading, cta }) => {
  return (
    <Container>
      <IconContainer error={false}>
        <MdBeenhere style={{ width: "1.25rem", height: "1.25rem" }} />
      </IconContainer>
      <TextContainer>
        <InfoHeading>{heading}</InfoHeading>
        <InfoSubHeading>{cta}</InfoSubHeading>
      </TextContainer>
      <HiXContainer>
        <HiX
          style={{
            width: "1rem",
            height: "1rem",
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </HiXContainer>
    </Container>
  );
};

export default ErrorToast;

import { FC } from "react";
import { HiX } from "react-icons/hi";

import Icon from "../Icon/Icon";
import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  IconContainer,
  HiXContainer,
  TextContainer,
} from "./Toast.styles";

export type CopyToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  heading: string;
};

const CopyToast: FC<CopyToastProps> = ({ onClose, heading }) => {
  return (
    <Container>
      <IconContainer error={false}>
        <Icon name="copy2" />
      </IconContainer>
      <TextContainer>
        <InfoHeading>{heading}</InfoHeading>
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

export default CopyToast;

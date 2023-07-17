import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { MdBeenhere } from "react-icons/md";

import { FullOrderERC20 } from "@airswap/types";

import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  HiXContainer,
  IconContainer,
  TextContainer,
} from "./Toast.styles";

export type OrderToastProps = {
  order: FullOrderERC20;
  onClose: () => void;
};

const OrderToast: FC<OrderToastProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <IconContainer>
        <MdBeenhere style={{ width: "1.25rem", height: "1.25rem" }} />
      </IconContainer>
      <TextContainer>
        <InfoHeading>{t("orders.orderSuccessfullyCreated")}</InfoHeading>
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

export default OrderToast;

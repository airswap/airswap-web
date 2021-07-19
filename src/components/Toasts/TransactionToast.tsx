import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import {
  Container,
  HiXContainer,
  IconContainer,
  TextContainer,
} from "./TransactionToast.styles";

export type TransactionToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  /**
   * Duration of toast pop up in ms. (30000ms (30s) is default)
   */
  duration: number;
  /**
   * Formatted start time of toast on initial load (e.g. 01:12 am).
   */
  startTime: string;
  /**
   * The type of text shown based off of i18n mapping.
   * enum types: approval, transactionPending, transactionSuccess, transactionFail
   */
  type:
    | "toast:approval"
    | TemplateStringsArray
    | "toast:transactionPending"
    | "toast:transactionSuccess"
    | "toast:transactionFail"
    | (
        | "toast:approval"
        | TemplateStringsArray
        | "toast:transactionPending"
        | "toast:transactionSuccess"
        | "toast:transactionFail"
      );
  /**
   * Error affects whether the icon colors show up as blue or red;
   */
  error?: boolean;
  /**
   * Optional parameter for passing in token approval/transaction amount.
   * e.g. "Please approve {amount} AST tokens"
   */
  amount?: string;
  /**
   * Optional parameter for passing in token approval/transaction symbol.
   * e.g. "Please approve 1000 {symbol} tokens"
   */
  token?: string;
};

const TransactionToast = ({
  onClose,
  duration = 30000,
  startTime,
  type,
  error = false,
  amount,
  token,
}: TransactionToastProps) => {

  const { t } = useTranslation(["toast"]);

  return (
    <Container>
      <IconContainer error={error}>
        <BiInfoCircle style={{ width: "1rem", height: "1rem" }} />
      </IconContainer>
      <TextContainer>
        {type === "toast:approval"
          ? t(type, { amount: amount, token: token })
          : t(type)}
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

export default TransactionToast;

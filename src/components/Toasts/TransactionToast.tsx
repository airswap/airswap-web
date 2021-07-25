import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { StyledParagraph } from "../Typography/Typography.styles";
import {
  Container,
  HiXContainer,
  IconContainer,
  InfoContainer,
  TextContainer,
  TimeContainer,
  TimerBarContainer,
  TimerBar,
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
  const [timeLeft, setTimeLeft] = useState(duration);
  const [paused, setPaused] = useState(false);

  const { t } = useTranslation(["toast"]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (timeLeft <= 1000) {
        clearInterval(interval);
        onClose();
        return;
      }
      if (!paused) setTimeLeft(timeLeft - 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, paused, onClose]);

  return (
    <Container
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <InfoContainer>
        <IconContainer error={error}>
          <BiInfoCircle style={{ width: "1.5rem", height: "1.5rem" }} />
        </IconContainer>
        <TextContainer>
          {type === "toast:approval"
            ? t(type, { amount: amount, token: token })
            : t(type)}
        </TextContainer>
        <HiXContainer>
          <HiX
            style={{
              float: "right",
              margin: "0 1rem 0 0",
              width: "1rem",
              height: "1rem",
              cursor: "pointer",
            }}
            onClick={onClose}
          />
        </HiXContainer>
      </InfoContainer>
      <TimeContainer>
        <StyledParagraph>{startTime}</StyledParagraph>
        <StyledParagraph>{Math.floor(timeLeft / 1000)} sec </StyledParagraph>
      </TimeContainer>
      <TimerBarContainer duration={duration / 1000} error={error}>
        <TimerBar className="timer-bar"></TimerBar>
      </TimerBarContainer>
    </Container>
  );
};

export default TransactionToast;

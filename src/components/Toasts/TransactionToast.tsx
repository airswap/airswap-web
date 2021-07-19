import { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { Container, HiXContainer, IconContainer, InfoContainer, TextContainer, TimeContainer, TimerBar } from "./TransactionToast.styles";

export type TransactionToastProps = {
  onClose: any;
  duration: number;
  startTime: Date;
  text: string;
};

const TransactionToast = ({
  onClose,
  duration,
  startTime,
  text,
}: TransactionToastProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (timeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onClose();
        return;
      }

      if (!paused) setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, paused, onClose]);

  const formatDate = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hrs = hours % 12 ? hours % 12 : 12; // the hour '0' should be '12'
    const min = minutes < 10 ? "0" + minutes : minutes.toString();
    return hrs + ":" + min + " " + (hours >= 12 ? "pm" : "am");
  };

  return (
    <Container
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <InfoContainer>
        <IconContainer>
          <BiInfoCircle style={{width: "24px", height: "24px"}}/>
        </IconContainer>
        <TextContainer>{text}</TextContainer>
        <HiXContainer>
          <HiX
            style={{ float: "right", margin: "0 16px 0 0", width: "16px", height: "16px", cursor: "pointer"}}
            onClick={onClose}
          />
        </HiXContainer>
      </InfoContainer>
      <TimeContainer>
        <span>{formatDate(startTime)}</span>
        <span>{timeLeft}s</span>
      </TimeContainer>
      <TimerBar duration={duration} error={false}>
        <div className="timer-bar"></div>
      </TimerBar>
    </Container>
  );
};

export default TransactionToast;

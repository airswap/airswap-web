import { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import styled, { keyframes } from 'styled-components/macro';

const Container = styled.div`
  color: white;

  &:hover .timer-bar {
    animation-play-state: paused;
  }
`;

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 16px;
`;

const HiXContainer = styled.div``;

const TextContainer = styled.div`
  margin: 0 16px;
  font-weight: 700;
  font-size: 14px;
`;

const TimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px;
`;


// Create the keyframes
const roundtime = keyframes`
  to {
    transform: scaleX(0);
  }
`;

type TimerBarProps = {
  duration: number;
  error: boolean;
};

const TimerBar = styled.div<TimerBarProps>`
  position: relative;
  top: 4px;
  overflow: hidden;
  background: #2b2b2b;
  width: 100%;

  div {
    height: 10px;
    animation: ${roundtime} calc(${(props) => props.duration || 30}s) forwards
      linear;
    transform-origin: left center;
    background: ${(props) => (props.error ? "red" : "#2B71FF")};
  }
`;

const IconContainer = styled.div`
  background: #2b71ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin: 0 0 0 16px;
`;

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
          <BiInfoCircle style={{width: "20px", height: "20px"}}/>
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

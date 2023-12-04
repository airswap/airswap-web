import { Container } from "./Timer.styles";
import { useState, useEffect } from "react";

export type TimerProps = {
  /**
   * Expiration time in unix timestamp (s)
   */
  expiryTime: number;
  onTimerComplete?: () => void;
  className?: string;
};

export const Timer = ({
  expiryTime = Date.now() / 1000 + 300,
  onTimerComplete,
  className,
}: TimerProps) => {
  const [distance, setDistance] = useState<number>(
    Math.floor(expiryTime - Date.now() / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const dist: number = Math.floor(expiryTime - Date.now() / 1000);

      if (dist <= 0) {
        setDistance(0);
        clearInterval(interval);
        onTimerComplete && onTimerComplete();
        return;
      }

      setDistance(dist);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [expiryTime, onTimerComplete]);

  return distance !== undefined ? (
    <Container className={className}>
      {Math.floor(distance / 60)}:
      {Math.floor(distance % 60) < 10
        ? `0${Math.floor(distance % 60)}`
        : Math.floor(distance % 60)}
    </Container>
  ) : null;
};

export default Timer;

import { useState, useEffect } from "react";

export type TimerProps = {
  className?: string;

  expiryTime: number;
  onTimerComplete: () => void;
};

export const Timer = ({
  expiryTime = new Date().getTime() + 30000,
  onTimerComplete,
}: TimerProps) => {

  const [distance, setDistance] = useState<number>();


  useEffect(() => {
    let interval = setInterval(() => {
      const now: Date = new Date();
      const dist: number = Math.floor(expiryTime - now.getTime() / 1000);

      if (dist <= 0) {
        clearInterval(interval);
        return;
      }

      setDistance(dist);

    }, 1000);
    
  });

  return (
    distance ? 
      <span>
        {Math.floor(distance / 60)}:{Math.floor(distance % 60) < 10 ? `0${Math.floor(distance % 60)}` : Math.floor(distance % 60)}
      </span> : <span>0:00</span>
  );
};

export default Timer;

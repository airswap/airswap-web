import { useState, useEffect } from "react";

export type TimerProps = {
  className?: string;
  unixTimestamp: number;
  timerDisabled: boolean;
  onTimerComplete: () => void;
}

export const Timer = ({
  unixTimestamp = (new Date()).getTime() + 30000,
  onTimerComplete,
  timerDisabled,
}: TimerProps) => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] =  useState<number>(0);

  
  useEffect(() => {
    const now = new Date();
    const unixDate: Date = new Date(unixTimestamp * 1000);
    const distance = (unixDate.getTime() - now.getTime()) / 1000;
    setMinutes(Math.round(distance / 60));
    setSeconds(Math.round(distance / 3600));
  }, [unixTimestamp])

  useEffect(() => {
    if (!timerDisabled) {
      let myInterval = setInterval(() => {
        if (timerDisabled) {
          clearInterval(myInterval);
        }
        if (seconds > 0) {
            setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
              clearInterval(myInterval)
              onTimerComplete();
          } else {
              setMinutes(minutes - 1);
              setSeconds(59);
          }
        } 
      }, 1000)
      return ()=> {
        clearInterval(myInterval);
      };
    }
  });

  return (
    <span>
      {timerDisabled ? "0:00" : `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </span>
  )
}

export default Timer;

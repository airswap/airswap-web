import classNames from "classnames";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useState, useEffect } from "react";

export type TimerProps = {
  className?: string;
  initialMinute: number;
  initialSeconds: number;
  onTimerComplete: () => void;
}

export const Timer = ({
  initialMinute = 0,
  initialSeconds = 0,
  onTimerComplete
}: TimerProps) => {
  const [minutes, setMinutes] = useState<number>(initialMinute);
  const [seconds, setSeconds] =  useState<number>(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
          setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(myInterval)
            onTimerComplete();
            setMinutes(initialMinute);
            setSeconds(initialSeconds);
        } else {
            setMinutes(minutes - 1);
            setSeconds(59);
        }
      } 
    }, 1000)
    return ()=> {
      clearInterval(myInterval);
    };
  });
  return (
      <span>
        {minutes}:{seconds < 10 ?  `0${seconds}` : seconds}
      </span>
  )
}

export default Timer;

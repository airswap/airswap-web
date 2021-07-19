import { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import styled, { keyframes } from "styled-components";

function formatAMPM(date: Date) {
  var hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const min = minutes < 10 ? "0" + minutes : minutes.toString();
  const strTime = hours + ":" + min + " " + ampm;
  return strTime;
}

// Create the keyframes
const roundtime = keyframes`
to {
  transform: scaleX(0);
}
`;

const TimerBar = styled.div`
  margin: 1rem;
  overflow: hidden;

  div {
    height: 5px;
    animation: ${roundtime} calc(30s) forwards linear;
    transform-origin: left center;
    background: linear-gradient(to bottom, #64b5f6, #1565c0);
  }
`;

type ToastComponentProps = {
  onClose: any;
  duration: number;
};
const ToastComponent = ({ onClose, duration }: ToastComponentProps) => {

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let interval = setInterval(() => {

      if (timeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        return;
      }

      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  return (
    <div>
      <div className="bg-black flex justify-around">
        <div className="bg-primary-500 rounded-full flex justify-center items-center m-6 w-16 h-8">
          <BiInfoCircle className="text-white text-xl pointer-events-none" />
        </div>
        <div>Please approve xxx _______ tokens for withdrawl</div>
        <HiX className="text-white text-xl cursor-pointer font-bold" onClick={onClose}/>
      </div>
      <div className="flex justify-between">
        <span>{formatAMPM(new Date())}</span>
        <span>{timeLeft}s</span>
      </div>
      <TimerBar>
        <div></div>
      </TimerBar>
    </div>
  );
};

export default ToastComponent;

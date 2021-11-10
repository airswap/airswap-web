import { FC } from "react";

import { Track, Progress } from "./ProgressBar.styles";

const ProgressBar: FC<{
  startTime: number;
  endTime: number;
}> = ({ startTime, endTime }) => {
  const now = Date.now();
  const done = now - startTime;
  const left = endTime - startTime;
  const fractionDone = done / left;
  return (
    <Track>
      <Progress
        animate={{ scaleX: 1 }}
        initial={{ scaleX: fractionDone }}
        transition={{ ease: "linear", duration: left / 1000 }}
      />
    </Track>
  );
};

export default ProgressBar;

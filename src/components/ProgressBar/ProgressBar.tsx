import { FC, useEffect, useState } from "react";

import { Track, Progress } from "./ProgressBar.styles";
import getProgressBarAnimationProps from "./helpers/getProgressBarAnimationProps";

const ProgressBar: FC<{
  startTime: number;
  endTime: number;
}> = ({ startTime, endTime }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { progress, duration } = getProgressBarAnimationProps(
    new Date(startTime),
    new Date(endTime),
    new Date()
  );

  return (
    <Track>
      <Progress
        initialWidth={progress * 100}
        duration={duration}
        style={{ ...(isMounted && { width: "100%" }) }}
      />
    </Track>
  );
};

export default ProgressBar;

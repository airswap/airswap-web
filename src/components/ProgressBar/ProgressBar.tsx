import { FC, useEffect, useState } from "react";

import { Track, Progress } from "./ProgressBar.styles";
import getProgressBarAnimationProps from "./helpers/getProgressBarAnimationProps";

const ProgressBar: FC<{
  startTime: number;
  endTime: number;
}> = ({ startTime, endTime }) => {
  const [isMounted, setIsMounted] = useState(false);

  // `isMounted` will be false until the component has rendered once. We use this
  // so that we can set the initial width of the progress bar to correspond with
  // the initial progress, before setting the "target" to 100% for the CSS transition

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { initialProgress, duration } = getProgressBarAnimationProps(
    new Date(startTime),
    new Date(endTime),
    new Date()
  );

  return (
    <Track>
      <Progress
        initialWidth={initialProgress}
        duration={duration}
        style={{ ...(isMounted && { transform: "scaleX(1)" }) }}
      />
    </Track>
  );
};

export default ProgressBar;

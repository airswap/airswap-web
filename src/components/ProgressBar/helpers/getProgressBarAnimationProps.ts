interface ProgressBarAnimationProps {
  /**
   * Progression since startTime compared to now, number between 0 and 1.
   */
  initialProgress: number;
  /**
   * Difference of startTime and endTime in seconds divided by progress ;
   */
  duration: number;
}

export default function getProgressBarAnimationProps(
  startTime: Date,
  endTime: Date,
  now: Date
): ProgressBarAnimationProps {
  const minStartTime = endTime.getTime() - 300000;
  const justifiedStartTime = Math.max(minStartTime, startTime.getTime());
  const totalDuration = endTime.getTime() - justifiedStartTime;
  const durationLeft = Math.max(endTime.getTime() - now.getTime(), 0);
  const progress = Math.max(1 - durationLeft / totalDuration, 0);
  const durationLeftInSeconds = Math.round(
    ((1 - progress) * totalDuration) / 1000
  );

  return {
    duration: durationLeftInSeconds,
    initialProgress: Math.round(progress * 100) / 100,
  };
}

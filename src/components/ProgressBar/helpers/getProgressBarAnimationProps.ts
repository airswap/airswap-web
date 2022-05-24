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
  const totalDuration = endTime.getTime() - startTime.getTime();
  const durationLeft = Math.max(endTime.getTime() - now.getTime(), 0);
  const progress = Math.max(1 - durationLeft / totalDuration, 0);
  const durationLeftInSeconds = ((1 - progress) * totalDuration) / 1000;

  return {
    duration: durationLeftInSeconds,
    initialProgress: progress,
  };
}

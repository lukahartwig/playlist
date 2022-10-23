import { formatDuration, intervalToDuration } from "date-fns";

interface Props {
  durationMs: number;
}

export function Playtime({ durationMs }: Props) {
  const duration = intervalToDuration({
    start: 0,
    end: durationMs,
  });

  const formatted = formatDuration(duration, {
    format: ["years", "months", "weeks", "days", "hours", "minutes"],
  });

  return <>{formatted || "<1 minute"}</>;
}

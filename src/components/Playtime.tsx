import { formatDuration, intervalToDuration } from "date-fns";

interface Props {
  durationMs: number;
}

export function Playtime({ durationMs }: Props) {
  const duration = intervalToDuration({
    start: 0,
    end: durationMs,
  });

  const fomratted = formatDuration(duration, {
    format: ["years", "months", "weeks", "days", "hours", "minutes"],
  });

  return <>{fomratted}</>;
}

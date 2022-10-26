import { intervalToDuration, formatDuration } from "date-fns";

export function formatPlaytime(playtimeMs: number) {
  const duration = intervalToDuration({
    start: 0,
    end: playtimeMs,
  });

  const formatted = formatDuration(duration, {
    format: ["years", "months", "weeks", "days", "hours", "minutes"],
  });

  return formatted || "<1 minute";
}

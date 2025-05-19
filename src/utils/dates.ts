import type { EventTiming } from "../utils/types";

export function getEventTiming(dateString: string, now: Date = new Date()): EventTiming {
  if (!dateString) {
    return { label: '', className: '', isToday: false };
  }

  const eventDate = new Date(dateString);

  // Zero out time to compare just dates
  const todayDateOnly = new Date(now.toISOString().split("T")[0]);
  const eventDateOnly = new Date(eventDate.toISOString().split("T")[0]);

  const diffTime = eventDateOnly.getTime() - todayDateOnly.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return { label: "Today!", className: "badge--today", isToday: true };
  }
  if (days === 1) {
    return { label: "Tomorrow", className: "badge--tomorrow", isToday: false };
  }
  if (days < 7) {
    return { label: `in ${days} days`, className: "badge--future", isToday: false };
  }
  if (days < 30) {
    const weeks = days / 7;
    const roundedWeeks = Math.round(weeks);
    const descriptor =
      weeks < roundedWeeks ? "just under" : weeks > roundedWeeks ? "just over" : "about";
    return {
      label: `in ${descriptor} ${roundedWeeks} week${roundedWeeks > 1 ? "s" : ""}`,
      className: "badge--future",
      isToday: false,
    };
  }

  const months = days / 30;
  const roundedMonths = Math.round(months);
  const descriptor =
    months < roundedMonths ? "just under" : months > roundedMonths ? "just over" : "about";
  return {
    label: `in ${descriptor} ${roundedMonths} month${roundedMonths > 1 ? "s" : ""}`,
    className: "badge--future",
    isToday: false,
  };
}

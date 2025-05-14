export function getEventTiming(dateString: string): {
  label: string;
  className: string;
  isToday: boolean;
} {
  if (!dateString) {
    return { label: '', className: '', isToday: false };
  }

  const today = new Date();
  const eventDate = new Date(dateString);

  // Zero out time to compare just dates
  const todayDateOnly = new Date(today.toISOString().split("T")[0]);
  const eventDateOnly = new Date(eventDate.toISOString().split("T")[0]);

  const diffTime = eventDateOnly.getTime() - todayDateOnly.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return { label: "Today!", className: "badge--today", isToday: true };
  }
  if (days === 1) {
    return { label: "Tomorrow", className: "badge--tomorrow", isToday: false };
  }
  if (days > 1) {
    return { label: `in ${days} days`, className: "badge--future", isToday: false };
  }

  // Optional: past events
  return { label: "In the past", className: "badge--past", isToday: false };
}

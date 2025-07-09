// src/components/homepage/EventBadge.tsx
import React from "react";
import { getEventTiming } from "../../utils/dates";

interface Props {
  date: string;
}

export default function EventBadge({ date }: Props) {
  const { label } = getEventTiming(date);
  return (
    <span className="aside-card__badge badge">{label}</span>
  );
}


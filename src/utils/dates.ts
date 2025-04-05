export function isToday(dateString: string): boolean {
    if (!dateString) return false; // Guard against undefined/null
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    return dateString === today;
  }
  export function daysUntil(dateString: string): number {
    if (!dateString) return 0; // Guard against undefined/null
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  }
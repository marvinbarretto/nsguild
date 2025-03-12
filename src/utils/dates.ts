export function isToday(dateString: string): boolean {
    if (!dateString) return false; // Guard against undefined/null
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    return dateString === today;
  }
  
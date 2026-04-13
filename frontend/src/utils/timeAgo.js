export const timeAgo = (date) => {
  if (!date) return 'Just now';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Just now'; // Invalid date
  
  const now = new Date();
  const seconds = Math.floor((now - dateObj) / 1000);
  
  if (seconds < 60) return `${Math.max(0, seconds)}s`; // Ensure no negative seconds
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

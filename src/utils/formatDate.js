export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Format sang ngày Việt Nam: dd/mm/yyyy hh:mm
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
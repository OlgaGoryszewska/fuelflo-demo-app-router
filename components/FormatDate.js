export default function formatDate(dateValue) {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

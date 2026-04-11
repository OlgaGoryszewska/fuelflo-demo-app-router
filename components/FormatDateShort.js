export default function formatDateShort(dateValue) {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

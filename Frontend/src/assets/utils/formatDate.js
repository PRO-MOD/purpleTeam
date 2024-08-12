// utils/dateUtils.js
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-in'); // Customize the format as needed
  }
  
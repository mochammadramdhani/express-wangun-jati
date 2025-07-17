export function formatTanggal(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", options); // Format: 16 Mei 2025
}

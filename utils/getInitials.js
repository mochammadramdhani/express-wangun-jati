export function getInitials(username) {
  if (!username) return "";
  const words = username.trim().split(/\s+/);
  const initials = words.map((word) => word[0].toUpperCase()).join("");
  return initials;
}

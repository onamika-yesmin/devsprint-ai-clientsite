export function fileToDataUrl(file: File, maxBytes = 1_500_000): Promise<string> {
  if (!file.type.startsWith("image/")) return Promise.reject(new Error("Please choose an image file."));
  if (file.size > maxBytes) return Promise.reject(new Error("Image must be under 1.5MB."));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

export function initials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

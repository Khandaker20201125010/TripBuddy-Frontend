export const getImageSrc = (image?: string | null): string => {
  if (!image || image.trim() === "") {
    return "/images/placeholder-9.jpg";
  }
  return image;
};
export function getImageUrl(src: string | Blob | undefined): string {
  if (!src) return '/images/userProfile.jpg';
  
  // If it's a Blob (from URL.createObjectURL), convert to string
  if (src instanceof Blob) {
    return URL.createObjectURL(src);
  }
  
  // If it's already a full URL, return it
  if (src.startsWith('http')) {
    return src;
  }
  
  // If it's a relative path, prepend the API URL
  if (src.startsWith('/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${apiUrl}${src}`;
  }
  
  // Default fallback
  return '/images/userProfile.jpg';
}



export function getInitials(name?: string): string {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
export const getImageSrc = (image?: string) => {
  if (!image || image.trim() === "") {
    return "/images/placeholder-9.jpg";
  }
  return image;
};

/**
 * Обрабатывает URL изображения, заменяя placeholder на реальное изображение
 * @param imageUrl - URL изображения от API
 * @returns Обработанный URL изображения
 */
export function processImageUrl(imageUrl: string | null | undefined): string {
  const defaultPlaceholder = "https://i.pinimg.com/736x/d8/8e/66/d88e66de6013f2eced5704fcd1e28782.jpg";
  
  // Если изображение отсутствует или пустое
  if (!imageUrl || imageUrl.trim() === "") {
    return defaultPlaceholder;
  }
  
  // Если URL содержит "placeholder" - заменяем на наш placeholder
  if (imageUrl.toLowerCase().includes("placeholder")) {
    return defaultPlaceholder;
  }
  
  return imageUrl;
} 
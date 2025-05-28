/**
 * Обрабатывает URL изображения, заменяя placeholder на реальное изображение
 * @param imageUrl - URL изображения от API
 * @returns Обработанный URL изображения
 * 
 * Примеры использования:
 * processImageUrl("https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw500%2F26DEV1HUH08MgvPvWUfBFJ45846.jpg&w=1920&q=75")
 * // Результат: "https://image.tmdb.org/t/p/w500/26DEV1HUH08MgvPvWUfBFJ45846.jpg"
 */
export function processImageUrl(imageUrl: string | null | undefined): string {
  const defaultPlaceholder = "https://i.pinimg.com/736x/d8/8e/66/d88e66de6013f2eced5704fcd1e28782.jpg";
  
  // Если изображение отсутствует или пустое
  if (!imageUrl || imageUrl.trim() === "") {
    return defaultPlaceholder;
  }
  
  let processedUrl = imageUrl.trim();
  
  // Декодируем URL если он закодирован
  try {
    processedUrl = decodeURIComponent(processedUrl);
  } catch (error) {
    console.warn("Failed to decode URL:", imageUrl);
  }
  
  // Удаляем параметры &w= и &q= если они есть
  processedUrl = processedUrl.replace(/[&?]w=\d+/g, '').replace(/[&?]q=\d+/g, '');
  
  // Если URL содержит "placeholder" - заменяем на наш placeholder
  if (processedUrl.toLowerCase().includes("placeholder")) {
    return defaultPlaceholder;
  }
  
  return processedUrl;
} 
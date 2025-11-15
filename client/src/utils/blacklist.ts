// Утилита для работы с черным списком картинок в LocalStorage

const BLACKLIST_KEY = 'blacklisted_images';

// Получить весь черный список
export function getBlacklist() {
  try {
    const blacklist = localStorage.getItem(BLACKLIST_KEY);
    return blacklist ? JSON.parse(blacklist) : [];
  } catch (error) {
    return [];
  }
}

// Добавить картинку в черный список
export function addToBlacklist(imageURL) {
  try {
    const blacklist = getBlacklist();
    if (!blacklist.includes(imageURL)) {
      blacklist.push(imageURL);
      localStorage.setItem(BLACKLIST_KEY, JSON.stringify(blacklist));
    }
  } catch (error) {
    console.log('Ошибка при добавлении в черный список:', error);
  }
}

// Проверить, есть ли картинка в черном списке
export function isBlacklisted(imageURL) {
  const blacklist = getBlacklist();
  return blacklist.includes(imageURL);
}

// Удалить картинку из черного списка (на случай, если понадобится)
export function removeFromBlacklist(imageURL) {
  try {
    const blacklist = getBlacklist();
    const filtered = blacklist.filter(url => url !== imageURL);
    localStorage.setItem(BLACKLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.log('Ошибка при удалении из черного списка:', error);
  }
}


export function getCacheItem(key) {
  const item = localStorage.getItem(process.env.VUE_APP_KEY + '_' + key);
  return (item && typeof item === 'string') && (item.indexOf('{') === 0 || item.indexOf('[') === 0) ? JSON.parse(item) : item;
}

export function setCacheItem(key, value) {
  return localStorage.setItem(process.env.VUE_APP_KEY + '_' + key, typeof value === 'object' ? JSON.stringify(value) : value);
}

export function delCacheItem(key) {
  return localStorage.removeItem(process.env.VUE_APP_KEY + '_' + key);
}

export const TOKEN = 'token'; // token
export const USER = 'user'; // 用户信息
export const MENUS = 'menus'; // 用户菜单
export const FLAT_MENUS = 'flat_menus'; // 铺平的菜单

// js/modules/utils.js

/**
 * 使用 Unicode 正规化把全角字符转为半角
 */
export function sanitizeForQRCode(str) {
	let safe = str.normalize("NFKC");
	// 常见全角标点替换
	safe = safe
	  .replace(/，/g, ',')
	  .replace(/。/g, '.')
	  .replace(/：/g, ':')
	  .replace(/；/g, ';')
	  .replace(/（/g, '(')
	  .replace(/）/g, ')')
	  .replace(/！/g, '!')
	  .replace(/？/g, '?');
	return safe;
  }
  
  /**
   * 若生成失败，可尝试 ASCII 兜底
   */
  export function toFallbackASCII(str) {
	return unescape(encodeURIComponent(str));
  }
// js/modules/config.js

// 全局配置对象（你也可以做成 class 或其它形式）
export let config = {
	dataType: 'text',
	text: '',
	url: '',
	wifiSsid: '',
	wifiPassword: '',
	emailAddress: '',
	emailSubject: '',
	qrSize: 200,
	colorDark: '#000000',
	colorLight: '#ffffff'
  };
  
  /** 从 localStorage 加载配置 */
  export function loadFromLocalStorage() {
	const data = localStorage.getItem('qrConfig');
	if (data) {
	  return JSON.parse(data);
	}
	return null;
  }
  
  /** 保存配置到 localStorage */
  export function saveToLocalStorage(cfg) {
	localStorage.setItem('qrConfig', JSON.stringify(cfg));
  }
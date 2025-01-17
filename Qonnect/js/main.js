// js/main.js
import { config, loadFromLocalStorage } from './modules/config.js';
import { 
  initInputs, 
  initAppearance, 
  initDownloadEvent, 
  initDecodeZone, 
  bindClearStorageEvent, 
  initQRCodeEnlarge 
} from './modules/ui.js';
import { generateQRCode } from './modules/generate.js';
// import { registerServiceWorker, initPWAInstallPrompt } from './modules/pwa.js'; // 已删除

window.addEventListener('DOMContentLoaded', () => {
  // 从本地存储加载或初始化 config
  const savedConfig = loadFromLocalStorage();
  if (savedConfig) {
    Object.assign(config, savedConfig);
  }

  // 初始化 UI 相关事件绑定
  initInputs();
  initAppearance();
  initDownloadEvent();
  initDecodeZone();
  bindClearStorageEvent();
  initQRCodeEnlarge();

  // 生成二维码
  generateQRCode();

  // 以下两行与PWA相关，已删除
  // registerServiceWorker();
  // initPWAInstallPrompt();
});
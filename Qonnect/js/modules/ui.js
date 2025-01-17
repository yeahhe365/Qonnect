// js/modules/ui.js
import { config, saveToLocalStorage } from './config.js';
import { generateQRCode, downloadQRCode } from './generate.js';
import { decodeQRCodeFromFile } from './decode.js';

/** 自动调整 textarea 高度 */
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

/*************************************************************
 * 1) 输入 & 实时生成
 *************************************************************/
export function initInputs() {
  // 设置初始表单值
  document.getElementById('dataType').value = config.dataType;
  document.getElementById('textInput').value = config.text;
  document.getElementById('urlInput').value = config.url;
  document.getElementById('wifiSsid').value = config.wifiSsid;
  document.getElementById('wifiPassword').value = config.wifiPassword;
  document.getElementById('emailAddress').value = config.emailAddress;
  document.getElementById('emailSubject').value = config.emailSubject;

  toggleDataType(config.dataType);

  const textInput = document.getElementById('textInput');
  autoResizeTextarea(textInput); // 初始调整高度

  // 监听用户修改
  document.getElementById('dataType').addEventListener('change', (e) => {
    config.dataType = e.target.value;
    saveToLocalStorage(config);
    toggleDataType(config.dataType);
    generateQRCode();
  });
  document.getElementById('textInput').addEventListener('input', (e) => {
    config.text = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
    autoResizeTextarea(e.target); // 调整高度
  });
  document.getElementById('urlInput').addEventListener('input', (e) => {
    config.url = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('wifiSsid').addEventListener('input', (e) => {
    config.wifiSsid = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('wifiPassword').addEventListener('input', (e) => {
    config.wifiPassword = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('emailAddress').addEventListener('input', (e) => {
    config.emailAddress = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('emailSubject').addEventListener('input', (e) => {
    config.emailSubject = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
}

/** 根据 dataType 切换对应输入区域显示/隐藏 */
function toggleDataType(type) {
  document.getElementById('textWrapper').classList.add('hidden');
  document.getElementById('urlWrapper').classList.add('hidden');
  document.getElementById('wifiWrapper').classList.add('hidden');
  document.getElementById('emailWrapper').classList.add('hidden');

  switch (type) {
    case 'text':
      document.getElementById('textWrapper').classList.remove('hidden');
      break;
    case 'url':
      document.getElementById('urlWrapper').classList.remove('hidden');
      break;
    case 'wifi':
      document.getElementById('wifiWrapper').classList.remove('hidden');
      break;
    case 'email':
      document.getElementById('emailWrapper').classList.remove('hidden');
      break;
  }
}

/*************************************************************
 * 2) 外观设置 (尺寸、颜色)
 *************************************************************/
export function initAppearance() {
  document.getElementById('qrSize').value = config.qrSize;
  document.getElementById('colorDark').value = config.colorDark;
  document.getElementById('colorLight').value = config.colorLight;

  document.getElementById('qrSize').addEventListener('input', (e) => {
    config.qrSize = parseInt(e.target.value, 10) || 200;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('colorDark').addEventListener('input', (e) => {
    config.colorDark = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
  document.getElementById('colorLight').addEventListener('input', (e) => {
    config.colorLight = e.target.value;
    saveToLocalStorage(config);
    generateQRCode();
  });
}

/*************************************************************
 * 3) 下载二维码
 *************************************************************/
export function initDownloadEvent() {
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', downloadQRCode);
}

/*************************************************************
 * 4) 解码：拖拽 / 选择文件 / 粘贴
 *************************************************************/
export function initDecodeZone() {
  const decodeZone = document.getElementById('decodeZone');
  const decodeFileInput = document.getElementById('decodeFile');

  // 拖拽进入
  decodeZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    decodeZone.classList.add('dragover');
  });
  // 拖拽离开
  decodeZone.addEventListener('dragleave', () => {
    decodeZone.classList.remove('dragover');
  });
  // 放下文件
  decodeZone.addEventListener('drop', (e) => {
    e.preventDefault();
    decodeZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      decodeQRCodeFromFile(e.dataTransfer.files[0]);
    }
  });

  // 点击 file input
  decodeFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      decodeQRCodeFromFile(e.target.files[0]);
      e.target.value = ''; // 让下次可选同一文件
    }
  });

  // 粘贴
  window.addEventListener('paste', (e) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      decodeQRCodeFromFile(e.clipboardData.files[0]);
    }
  });
}

/*************************************************************
 * 5) 二维码点击 => 放大预览
 *************************************************************/
export function initQRCodeEnlarge() {
  const qrcodeEl = document.getElementById('qrcode');
  const modalOverlay = document.getElementById('qrModalOverlay');
  const modalImg = document.getElementById('qrModalImg');
  const modalClose = document.getElementById('qrModalClose');

  qrcodeEl.addEventListener('click', () => {
    const canvas = document.getElementById('qrcodeCanvas');
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    if (!dataURL) return;

    // 显示放大预览
    modalImg.src = dataURL;
    modalOverlay.style.display = 'flex';
  });

  modalClose.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
  });

  // 点击背景关闭
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });
}

/*************************************************************
 * 6) 清空本地缓存
 *************************************************************/
export function bindClearStorageEvent() {
  document.getElementById('clearStorageBtn').addEventListener('click', () => {
    if (confirm('确定要清空本地缓存吗？此操作不可恢复。')) {
      localStorage.removeItem('qrConfig');
      location.reload();
    }
  });
}

/*************************************************************
 * 7) 网络状态监听
 *************************************************************/
function handleNetworkChange() {
  const offlineBanner = document.getElementById('offlineBanner');
  if (!navigator.onLine) {
    offlineBanner.style.display = 'block';
  } else {
    offlineBanner.style.display = 'none';
  }
}

function initNetworkStatus() {
  handleNetworkChange();
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);
}

/*************************************************************
 * 8) 汇总初始化
 *************************************************************/
export function initUI() {
  initInputs();
  initAppearance();
  initDownloadEvent();
  initDecodeZone();
  initQRCodeEnlarge();
  bindClearStorageEvent();
  initNetworkStatus();
}
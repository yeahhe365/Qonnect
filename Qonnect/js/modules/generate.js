// js/modules/generate.js
import { config, saveToLocalStorage } from './config.js';
import { sanitizeForQRCode } from './utils.js';

/** 根据 dataType，拼装要放进二维码的文本 */
function getFinalQrData() {
  switch (config.dataType) {
    case 'text':
      return config.text;
    case 'url':
      return config.url;
    case 'wifi':
      // 默认假设加密方式为 WPA，可按需修改
      return `WIFI:T:WPA;S:${config.wifiSsid};P:${config.wifiPassword};;`;
    case 'email':
      return `mailto:${config.emailAddress}?subject=${encodeURIComponent(config.emailSubject)}`;
    default:
      return '';
  }
}

/** 生成二维码 */
export function generateQRCode() {
  const rawData = getFinalQrData().trim();
  const canvas = document.getElementById('qrcodeCanvas');
  const qrcodeContainer = document.getElementById('qrcode');

  if (!rawData) {
    // 若内容为空，则清空二维码画布
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  let sanitized = sanitizeForQRCode(rawData);
  
  // 将所有换行符统一为 \n
  sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 先清空画布
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 生成二维码
  QRCode.toCanvas(canvas, sanitized, {
    width: config.qrSize,
    color: {
      dark: config.colorDark,
      light: config.colorLight
    },
    errorCorrectionLevel: 'H',
    // 在QR码中支持多行文本
    margin: 1,
    scale: 4
  }, function (error) {
    if (error) {
      console.error(error);
      qrcodeContainer.innerHTML = '<p style="color: red;">二维码生成失败，请检查输入内容。</p>';
    } else {
      console.log('二维码生成成功！');
    }
  });
}

/** 下载二维码为图片 */
export function downloadQRCode() {
  const canvas = document.getElementById('qrcodeCanvas');
  if (!canvas) {
    alert('二维码未生成，请先生成二维码。');
    return;
  }
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = "qrcode.png";
  link.click();
}
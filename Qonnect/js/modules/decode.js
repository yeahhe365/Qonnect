// js/modules/decode.js

/**
 * 从 File 中解码二维码
 */
export function decodeQRCodeFromFile(file) {
	if (!file || !file.type.startsWith('image/')) {
	  alert('请选择有效的图片文件。');
	  return;
	}
	const reader = new FileReader();
	reader.onload = (evt) => {
	  const imgData = evt.target.result;
	  const img = new Image();
	  img.onload = () => {
		const canvas = document.getElementById('decode-canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
	  
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const code = jsQR(imageData.data, canvas.width, canvas.height);
		showDecodeResult(code);
	  };
	  img.onerror = () => {
		alert('图片加载失败，请确认文件是否有效。');
	  };
	  img.src = imgData;
	};
	reader.readAsDataURL(file);
  }
  
  /**
   * 将解码结果显示到页面上
   */
  function showDecodeResult(code) {
	const resultEl = document.getElementById('decodeResult');
	if (code) {
	  let rawData = code.data;
	  let decodeResult = '';
	  try {
		// 尝试进行解码，保留换行符
		decodeResult = decodeURIComponent(escape(rawData));
	  } catch (err) {
		decodeResult = rawData;
	  }
	  // 替换 \n 为真实换行符，以确保在页面中正确显示
	  decodeResult = decodeResult.replace(/\\n/g, '\n');
	  resultEl.textContent = decodeResult;
	} else {
	  resultEl.textContent = '未识别到二维码或二维码不清晰。';
	}
  }
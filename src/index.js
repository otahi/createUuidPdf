import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

function setDefaultValuesFromQuery() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('numPages')) {
    document.getElementById('numPages').value = params.get('numPages');
  }
  if (params.has('qrSize')) {
    document.getElementById('qrSize').value = params.get('qrSize');
  }
  if (params.has('pageWidth')) {
    document.getElementById('pageWidth').value = params.get('pageWidth');
  }
  if (params.has('pageHeight')) {
    document.getElementById('pageHeight').value = params.get('pageHeight');
  }
  if (params.has('qrX')) {
    document.getElementById('qrX').value = params.get('qrX');
  }
  if (params.has('qrY')) {
    document.getElementById('qrY').value = params.get('qrY');
  }
}

function updateQueryParams() {
  const params = new URLSearchParams();

  params.set('numPages', document.getElementById('numPages').value);
  params.set('qrSize', document.getElementById('qrSize').value);
  params.set('pageWidth', document.getElementById('pageWidth').value);
  params.set('pageHeight', document.getElementById('pageHeight').value);
  params.set('qrX', document.getElementById('qrX').value);
  params.set('qrY', document.getElementById('qrY').value);

  // クエリパラメータを更新
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function getUserInputs() {
  const numPages = parseInt(document.getElementById("numPages").value);
  const qrSize = parseInt(document.getElementById("qrSize").value);
  const pageWidth = parseInt(document.getElementById("pageWidth").value);
  const pageHeight = parseInt(document.getElementById("pageHeight").value);
  const qrX = parseInt(document.getElementById("qrX").value);
  const qrY = parseInt(document.getElementById("qrY").value);

  return { numPages, qrSize, pageWidth, pageHeight, qrX, qrY };
}

// onload

setDefaultValuesFromQuery();
updateQueryParams();

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('blur', updateQueryParams);
});

document.getElementById("generatePDF").addEventListener("click", async function() {
  const { numPages, qrSize, pageWidth, pageHeight, qrX, qrY } = getUserInputs();

  // ミリメートルをポイントに変換
  const mmToPt = mm => mm * 2.83465;
  const pageWidthPt = mmToPt(pageWidth);
  const pageHeightPt = mmToPt(pageHeight);
  const qrSizePt = mmToPt(qrSize);
  const qrXPt = mmToPt(qrX);
  const qrYPt = mmToPt(qrY);

  // もしPDFファイルをユーザーが指定していたらPDFファイルを読み込む
  const pdfFile = document.getElementById("pdfFile").files[0];
  let pdfDoc = null;
  if (pdfFile) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfFile);
    await new Promise(resolve => reader.onload = resolve);
    const pdfData = new Uint8Array(reader.result);
    pdfDoc = await PDFDocument.load(pdfData);
  } else {
    pdfDoc = await PDFDocument.create();
    for (let i = 0; i < numPages; i++) {
      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
      const uuid = uuidv4();
      const qrCodeDataUrl = await QRCode.toDataURL(uuid, { width: qrSizePt });
      const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
      page.drawImage(qrImage, { x: qrXPt, y: qrYPt, width: qrSizePt, height: qrSizePt });
      page.drawText(uuid, { x: qrXPt + (qrSizePt/10), y: qrYPt, size: qrSizePt/24 });
    }
  }

  if (pdfFile) {
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const uuid = uuidv4();
      const qrCodeDataUrl = await QRCode.toDataURL(uuid, { width: qrSizePt });
      const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
      page.drawImage(qrImage, { x: qrXPt, y: qrYPt, width: qrSizePt, height: qrSizePt });
      page.drawText(uuid, { x: qrXPt + (qrSizePt/10), y: qrYPt, size: qrSizePt/24 });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'uuid-qrcode.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
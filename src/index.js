import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

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

  const pdf = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });
  pdf.setFontSize(qrSize/7); // just fit?


  for (let i = 0 ; i < numPages; i++) {
    // UUIDを生成
    const uuid = uuidv4();

    // QRコードを生成して表示
    QRCode.toCanvas(document.getElementById('qrcode'), uuid, { width: 128 }, function (error) {
      if (error) console.error(error);
    });

    // QRコードのcanvasを取得
    const qrCanvas = document.querySelector("#qrcode");

    // QRコードをPDFに追加
    const imgData = qrCanvas.toDataURL("image/png");
    pdf.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize); // QRコードをPDFに追加
    pdf.text(`${uuid}`, qrX, qrY + qrSize); // テキストとしてUUIDを追加

    pdf.addPage();

  }

  // PDFをダウンロード
  pdf.save("uuid_qrcode.pdf");
});
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface UnifiedExportOptions {
  certificates: {
    recipientName: string;
    /** Base64 data URL from canvas.toDataURL() — must start with "data:image/" */
    imageDataUrl: string;
  }[];
  exportFormat: 'pdf' | 'image' | 'both';
  pdfMode: 'batch' | 'individual';
  eventName?: string;
}

/**
 * Determines PDF page orientation from an image by loading it into an
 * HTMLImageElement and comparing natural width vs height.
 *
 * Returns { width, height, orientation } where width/height are the
 * image's natural pixel dimensions.
 */
async function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number; orientation: 'landscape' | 'portrait' }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        orientation: img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait',
      });
    };
    img.onerror = () => reject(new Error('Failed to load image for dimension detection'));
    img.src = dataUrl;
  });
}

/**
 * Unified export function for generating PDFs and Images, either directly or zipped.
 */
export async function exportCertificatesUnified({
  certificates,
  exportFormat,
  pdfMode,
  eventName,
}: UnifiedExportOptions): Promise<void> {
  if (certificates.length === 0) {
    throw new Error('No certificates to export');
  }

  // Detect the image format from the data URL
  const detectFormat = (dataUrl: string): 'JPEG' | 'PNG' => {
    if (dataUrl.startsWith('data:image/png')) return 'PNG';
    return 'JPEG';
  };

  // Helper to convert dataURL to Blob
  const getImageBlob = async (dataUrl: string): Promise<Blob> => {
    const res = await fetch(dataUrl);
    return res.blob();
  };

  const safeEventName = eventName ? eventName.replace(/[^a-z0-9]/gi, '_') : Date.now().toString();

  // 1. Direct PDF Download Cases
  if (exportFormat === 'pdf') {
    if (pdfMode === 'individual' && certificates.length <= 5) {
      for (const cert of certificates) {
        const dims = await getImageDimensions(cert.imageDataUrl);
        const doc = new jsPDF({
          orientation: dims.orientation,
          unit: 'px',
          format: [dims.width, dims.height],
          hotfixes: ['px_scaling'],
        });
        const format = detectFormat(cert.imageDataUrl);
        doc.addImage(cert.imageDataUrl, format, 0, 0, dims.width, dims.height);
        const safeName = cert.recipientName.replace(/[^a-z0-9]/gi, '_');
        doc.save(`certificate-${safeName}.pdf`);
      }
      return;
    }

    if (pdfMode === 'batch') {
      const firstDims = await getImageDimensions(certificates[0].imageDataUrl);
      const doc = new jsPDF({
        orientation: firstDims.orientation,
        unit: 'px',
        format: [firstDims.width, firstDims.height],
        hotfixes: ['px_scaling'],
      });

      for (let i = 0; i < certificates.length; i++) {
        const cert = certificates[i];
        if (i > 0) doc.addPage([firstDims.width, firstDims.height], firstDims.orientation);
        const format = detectFormat(cert.imageDataUrl);
        doc.addImage(cert.imageDataUrl, format, 0, 0, firstDims.width, firstDims.height);
      }
      doc.save(`certificates-${safeEventName}.pdf`);
      return;
    }
  }

  // 2. ZIP Cases (Image only, Both, or Individual PDFs > 5)
  const zip = new JSZip();

  // Process Images
  if (exportFormat === 'image' || exportFormat === 'both') {
    const imagesFolder = zip.folder('images');
    for (const cert of certificates) {
      const blob = await getImageBlob(cert.imageDataUrl);
      const safeName = cert.recipientName.replace(/[^a-z0-9]/gi, '_');
      const ext = detectFormat(cert.imageDataUrl) === 'PNG' ? 'png' : 'jpg';
      imagesFolder?.file(`certificate-${safeName}.${ext}`, blob);
    }
  }

  // Process PDFs inside ZIP
  if (exportFormat === 'pdf' || exportFormat === 'both') {
    if (pdfMode === 'batch') {
      const firstDims = await getImageDimensions(certificates[0].imageDataUrl);
      const doc = new jsPDF({
        orientation: firstDims.orientation,
        unit: 'px',
        format: [firstDims.width, firstDims.height],
        hotfixes: ['px_scaling'],
      });

      for (let i = 0; i < certificates.length; i++) {
        const cert = certificates[i];
        if (i > 0) doc.addPage([firstDims.width, firstDims.height], firstDims.orientation);
        const format = detectFormat(cert.imageDataUrl);
        doc.addImage(cert.imageDataUrl, format, 0, 0, firstDims.width, firstDims.height);
      }
      const pdfBlob = doc.output('blob');
      zip.file(`certificates-${safeEventName}.pdf`, pdfBlob);
    } else {
      for (const cert of certificates) {
        const dims = await getImageDimensions(cert.imageDataUrl);
        const doc = new jsPDF({
          orientation: dims.orientation,
          unit: 'px',
          format: [dims.width, dims.height],
          hotfixes: ['px_scaling'],
        });
        const format = detectFormat(cert.imageDataUrl);
        doc.addImage(cert.imageDataUrl, format, 0, 0, dims.width, dims.height);
        const safeName = cert.recipientName.replace(/[^a-z0-9]/gi, '_');
        const pdfBlob = doc.output('blob');
        zip.file(`certificate-${safeName}.pdf`, pdfBlob);
      }
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `export-${safeEventName}.zip`);
}

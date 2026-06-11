import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Options for exporting certificates to PDF.
 *
 * @property certificates - Array of certificate data, each containing a recipient name
 *   and the rendered certificate image as a data URL (base64 JPEG/PNG from canvas).
 * @property mode - Export mode:
 *   - `"batch"`: All certificates combined into a single multi-page PDF.
 *   - `"individual"`: Each certificate saved as a separate PDF file (zipped if multiple).
 * @property eventName - Optional event name used in the output file name.
 */
interface PDFExportOptions {
  certificates: {
    recipientName: string;
    /** Base64 data URL from canvas.toDataURL() — must start with "data:image/" */
    imageDataUrl: string;
  }[];
  mode: 'batch' | 'individual';
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
 * Exports generated certificate images to PDF.
 *
 * In `"batch"` mode, produces a single multi-page PDF where each page contains
 * one full-bleed certificate image. The page size is derived from the first
 * certificate's aspect ratio to avoid distortion.
 *
 * In `"individual"` mode, creates and downloads a separate single-page PDF
 * for each certificate. If multiple certificates exist, they are compressed
 * into a single ZIP file for download.
 *
 * Uses jsPDF with pixel units for precise image-to-page mapping. The image
 * format is detected from the data URL prefix (JPEG or PNG).
 */
export async function exportCertificatesToPDF({
  certificates,
  mode,
  eventName,
}: PDFExportOptions): Promise<void> {
  if (certificates.length === 0) {
    throw new Error('No certificates to export');
  }

  // Detect the image format from the data URL (jsPDF needs "JPEG" or "PNG")
  const detectFormat = (dataUrl: string): 'JPEG' | 'PNG' => {
    if (dataUrl.startsWith('data:image/png')) return 'PNG';
    return 'JPEG';
  };

  if (mode === 'batch') {
    // --- Batch mode: single multi-page PDF ---

    // Use the first certificate's dimensions to set the page size.
    // This keeps the aspect ratio correct and avoids white borders.
    const firstDims = await getImageDimensions(certificates[0].imageDataUrl);
    const pageWidth = firstDims.width;
    const pageHeight = firstDims.height;

    const doc = new jsPDF({
      orientation: firstDims.orientation,
      unit: 'px',
      format: [pageWidth, pageHeight],
      hotfixes: ['px_scaling'],
    });

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];

      if (i > 0) {
        doc.addPage([pageWidth, pageHeight], firstDims.orientation);
      }

      const format = detectFormat(cert.imageDataUrl);

      // Draw the full certificate image spanning the entire page
      doc.addImage(cert.imageDataUrl, format, 0, 0, pageWidth, pageHeight);
    }

    const fileName = eventName
      ? `certificates-${eventName.replace(/[^a-z0-9]/gi, '_')}.pdf`
      : `certificates-${Date.now()}.pdf`;

    doc.save(fileName);
  } else {
    // --- Individual mode: one PDF per certificate ---
    if (certificates.length === 1) {
      const cert = certificates[0];
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
    } else {
      const zip = new JSZip();
      const folder = zip.folder('pdf_certificates');

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
        folder?.file(`certificate-${safeName}.pdf`, pdfBlob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const fileName = eventName
        ? `individual-certificates-${eventName.replace(/[^a-z0-9]/gi, '_')}.zip`
        : `individual-certificates-${Date.now()}.zip`;
      saveAs(zipBlob, fileName);
    }
  }
}

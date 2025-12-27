
import {PDFParse} from "pdf-parse"
import fetch from "node-fetch";

export const ExtractText = async (pdfSource) => {
  try {
    let buffer;
    
    // Handle different input types
    if (typeof pdfSource === 'string') {
      // If it's a URL
      if (pdfSource.startsWith('http')) {
        const response = await fetch(pdfSource);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      }
    } else if (Buffer.isBuffer(pdfSource)) {
      // If it's already a buffer
      buffer = pdfSource;
    } else {
      throw new Error('Invalid PDF source. Provide a URL, file path, or Buffer.');
    }

    const res = new PDFParse(buffer);
    const data = await res.getText();
    return data.text
      .split(" ")
      .filter(
        (word) =>
          word !== "\n" && 
          word !== "--" && 
          word !== "2" && 
          !word.includes("--")
        )
      .join(" ")
      
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};


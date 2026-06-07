const pdf = require('pdf-parse');

/**
 * Extract raw text from a PDF buffer
 */
async function extractText(buffer) {
  try {
    const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const parser = new pdf.PDFParse({ data: uint8, verbosity: 0 });
    
    const result = await parser.getText();
    
    if (typeof result === 'string') return result;
    if (result && typeof result.text === 'string') return result.text;
    if (result && Array.isArray(result.pages)) {
      return result.pages.map((p) => p.text).join('\n\n');
    }
    
    throw new Error('Could not find text property in PDF result.');
  } catch (err) {
    console.error('PDF Parse Error:', err.message);
    throw new Error('Failed to parse PDF document: ' + err.message);
  }
}

/**
 * Split text into overlapping chunks
 */
function chunkText(text, chunkSize = 3000, overlap = 300) {
  const chunks = [];
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  let start = 0;
  while (start < cleaned.length) {
    let end = Math.min(start + chunkSize, cleaned.length);
    
    if (end < cleaned.length) {
      const lastDot = cleaned.lastIndexOf('. ', end);
      if (lastDot > start + (chunkSize * 0.7)) {
        end = lastDot + 1;
      }
    }
    
    chunks.push(cleaned.slice(start, end).trim());
    start = end - overlap;
    if (start < 0) start = 0;
    if (end >= cleaned.length) break;
  }

  return chunks;
}

/**
 * Parse PDF buffer → cleaned chunks
 */
async function parsePDF(buffer) {
  const text = await extractText(buffer);
  if (!text || text.trim().length < 50) {
    throw new Error('PDF appears to be empty or contains no readable text.');
  }
  const chunks = chunkText(text);
  return { text, chunks };
}

module.exports = { parsePDF, chunkText, extractText };
